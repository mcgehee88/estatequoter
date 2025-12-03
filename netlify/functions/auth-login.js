const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Missing Supabase credentials' }),
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Email and password required' }),
      };
    }

    // Simple hardcoded admin check
    const ADMIN_EMAIL = 'estatequoter@gmail.com';
    if (email === ADMIN_EMAIL && password.length > 0) {
      // Generate a simple session token
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
      
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          success: true,
          session: { access_token: token },
          user: { email, id: 'admin-user' },
        }),
      };
    }

    return {
      statusCode: 401,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Invalid email or password' }),
    };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};


