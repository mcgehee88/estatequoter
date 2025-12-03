const { createClient } = require('@supabase/supabase-js');

// Simple auth: GitHub OAuth token (you can set this in Netlify env)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin-token-change-me';

exports.handler = async (event) => {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
  );

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const authHeader = event.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (token !== ADMIN_TOKEN) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    // Get stats
    const { count: totalLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    const { count: openLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open');

    const { count: totalQuotes } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true });

    const { count: totalPros } = await supabase
      .from('professionals')
      .select('*', { count: 'exact', head: true });

    // Get recent leads
    const { data: recentLeads } = await supabase
      .from('leads')
      .select('id, customer_name, customer_email, created_at, status')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent quotes
    const { data: recentQuotes } = await supabase
      .from('quotes')
      .select(
        'id, lead_id, professional_id, amount, created_at, status'
      )
      .order('created_at', { ascending: false })
      .limit(10);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        stats: {
          total_leads: totalLeads || 0,
          open_leads: openLeads || 0,
          total_quotes: totalQuotes || 0,
          total_professionals: totalPros || 0,
        },
        recent_leads: recentLeads || [],
        recent_quotes: recentQuotes || [],
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};


