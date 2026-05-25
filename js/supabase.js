// =====================================================
// SUPABASE CLIENT INITIALIZATION
// =====================================================

const SUPABASE_URL = 'https://kiojjjdgxpnhfubxiuns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb2pqamRneHBuaGZ1YnhpdW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MjUxODksImV4cCI6MjA5NTMwMTE4OX0.aHXWj1NBYLwato4S5nYzFxtDF1yYZfDjjY-PB-4Czcc';

// O CDN já declara "var supabase". Para não dar erro de "already declared",
// reatribuímos a variável global com o cliente inicializado.
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
