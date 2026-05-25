// =====================================================
// SUPABASE CLIENT INITIALIZATION
// =====================================================

// TODO: O USUÁRIO DEVE COLOCAR SUA URL E ANON KEY AQUI
const SUPABASE_URL = 'https://kiojjjdgxpnhfubxiuns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtpb2pqamRneHBuaGZ1YnhpdW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MjUxODksImV4cCI6MjA5NTMwMTE4OX0.aHXWj1NBYLwato4S5nYzFxtDF1yYZfDjjY-PB-4Czcc';

// Inicializa o cliente do Supabase
// (A biblioteca global 'supabase' é injetada via CDN no HTML)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
