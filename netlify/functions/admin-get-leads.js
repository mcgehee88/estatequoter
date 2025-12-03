const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod === 'GET' || event.httpMethod === 'POST') {
    try {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SECRET_KEY;

      if (!supabaseUrl || !supabaseKey) {
        return {
          statusCode: 500,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Supabase credentials not configured' }),
        };
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch all leads with all fields
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return {
          statusCode: 500,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: error.message }),
        };
      }

      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: data || [] }),
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: error.message }),
      };
    }
  } else {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
};

