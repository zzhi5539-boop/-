require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_KEY environment variables.");
}

const supabase = createClient(supabaseUrl || 'http://localhost:54321', supabaseKey || 'anon-key');

module.exports = supabase;
