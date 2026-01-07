require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { createClient } = require("@supabase/supabase-js");

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
// Serves frontend files from the root directory
app.use(express.static(path.join(__dirname, ".."))); 

/* -----------------------------------
   SUPABASE (SERVICE ROLE KEY)
----------------------------------- */
// Ensure these are in your .env file inside the /server folder
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY 
);

/* -----------------------------------
   QR SESSION STORE (IN-MEMORY)
----------------------------------- */
// Stores active session details indexed by their unique token
const qrSessions = {};

/* -----------------------------------
   ADMIN: GENERATE QR WITH CONTEXT
----------------------------------- */
app.post("/api/admin/generate-qr", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const accessToken = authHeader.split(" ")[1];

    // Verify admin via Supabase Auth
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data?.user) {
      return res.status(401).json({ error: "Invalid admin session" });
    }

    const admin_id = data.user.id;
    const { class_id, subject, time } = req.body;

    if (!class_id || !subject || !time) {
      return res.status(400).json({ error: "Missing class / subject / time" });
    }

    // Generate a unique 8-character token
    const sessionToken = `QR_${uuidv4().slice(0, 8)}`;

    // Save session context to memory
    qrSessions[sessionToken] = {
      admin_id,
      class_id,
      subject,
      time,
      created_at: Date.now()
    };

    console.log("New QR Session Started:", sessionToken);
    res.json({ token: sessionToken });

  } catch (err) {
    console.error("QR GENERATION ERROR:", err);
    res.status(500).json({ error: "QR generation failed" });
  }
});

/* -----------------------------------
   STUDENT: VERIFY & MARK ATTENDANCE
----------------------------------- */
app.post('/api/student/verify', async (req, res) => {
    try {
        const { usn, deviceId, sessionToken } = req.body;

        // 1. Validate token against the memory store
        const session = qrSessions[sessionToken];
        if (!session) {
            return res.status(403).json({ success: false, error: "QR Expired or Invalid. Scan again." });
        }

        const { admin_id, class_id, subject, time } = session;

        // 2. Prevent duplicate attendance for the same session
        const { data: existing } = await supabase
            .from("attendance_logs")
            .select("id")
            .eq("usn", usn)
            .eq("session_id", sessionToken)
            .limit(1);

        if (existing && existing.length > 0) {
            return res.status(409).json({ success: false, error: "Attendance already marked." });
        }

        // 3. Check for Device Fraud (Is device used by another student?)
        const { data: fraudCheck, error: fetchError } = await supabase
            .from('attendance_logs')
            .select('usn')
            .eq('device_id', deviceId)
            .neq('usn', usn);

        if (fetchError) throw fetchError;

        const status = (fraudCheck && fraudCheck.length > 0) ? 'fraud' : 'verified';

        // 4. Insert full log into Supabase
        const { error: insertError } = await supabase.from('attendance_logs').insert([{
            usn, 
            device_id: deviceId, 
            session_id: sessionToken, 
            admin_id,
            class_id,
            subject,
            time,
            status
        }]);

        if (insertError) throw insertError;

        res.json({ success: true, status });

    } catch (err) {
        console.error("Verification Error:", err.message);
        res.status(500).json({ success: false, error: "Database error. Try again." });
    }
});

/* -----------------------------------
   ADMIN: VIEW ATTENDANCE (HISTORY)
----------------------------------- */
app.get("/api/admin/attendance", async (req, res) => {
  try {
    const { class_id, subject, date } = req.query;

    let query = supabase
      .from("attendance_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (class_id) query = query.eq("class_id", class_id);
    if (subject) query = query.eq("subject", subject);

    const { data, error } = await query;
    if (error) return res.status(500).json(error);

    res.json(data);

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

// --- START SERVER ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Master Server Live at http://localhost:${PORT}`);
});