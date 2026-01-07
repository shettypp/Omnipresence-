import { createClient } from
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://lephbhqgebixmqdlsvrp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlcGhiaHFnZWJpeG1xZGxzdnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjQwNjMsImV4cCI6MjA4MzIwMDA2M30.8qBj7pzJS2DIdysSimjB1AdOSrb4prxKRFJZnc9zXmg"
);
