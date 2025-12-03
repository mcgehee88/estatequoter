const { createClient } = require('@supabase/supabase-js');

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
    const token = event.queryStringParameters?.token;
    if (!token) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    // Verify token and get professional
    const { data: authToken, error: tokenError } = await supabase
      .from('auth_tokens')
      .select('professional_id, expires_at')
      .eq('token', token)
      .single();

    if (tokenError || !authToken) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid or expired token' }),
      };
    }

    if (new Date(authToken.expires_at) < new Date()) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Token expired' }),
      };
    }

    // Get available leads (open leads only)
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select(
        `
        id, 
        customer_name, 
        customer_email, 
        property_type, 
        estate_location, 
        urgency, 
        notes,
        created_at,
        quotes(id, professional_id, status)
      `
      )
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (leadsError) throw leadsError;

    // Get professional's own quotes
    const { data: myQuotes, error: quotesError } = await supabase
      .from('quotes')
      .select('lead_id, status')
      .eq('professional_id', authToken.professional_id);

    if (quotesError) throw quotesError;

    const myQuoteLeadIds = new Set(myQuotes.map((q) => q.lead_id));

    // Enrich leads with quote status
    const enrichedLeads = leads.map((lead) => ({
      ...lead,
      has_quoted: myQuoteLeadIds.has(lead.id),
      total_quotes: lead.quotes?.length || 0,
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        leads: enrichedLeads,
        professional_id: authToken.professional_id,
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


