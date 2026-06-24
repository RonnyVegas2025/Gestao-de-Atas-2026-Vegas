import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rmfyswnoxpyfvebbkrwn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtZnlzd25veHB5ZnZlYmJrcnduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNjc2NjEsImV4cCI6MjA5Nzg0MzY2MX0.QNwX5PLDxZWonRjfN5U-ucXA0kEm4w2V488_Tv8QLAQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
