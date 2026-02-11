import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bkqcnozcoeqnlsyqgzee.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrcWNub3pjb2VxbmxzeXFnemVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4Mzg4ODQsImV4cCI6MjA4NjQxNDg4NH0.mVDzVBuQ23-YGxqF5dJWM4DMFRYE7iNeYWpZrOvWu2k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
