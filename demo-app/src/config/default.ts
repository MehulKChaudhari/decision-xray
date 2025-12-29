module.exports = {
  port: process.env.PORT || 3000,
  database: {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_ANON_KEY || ''
  }
};
