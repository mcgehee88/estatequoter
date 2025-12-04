const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Get professional ID from query params (from authenticated session)
    const professionalId = event.queryStringParameters?.professional_id;

    if (!professionalId) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing professional_id' }),
      };
    }

    // Fetch all leads for this professional
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false });

    if (leadsError) throw leadsError;

    // Fetch media for each lead
    let mediaMap = {};
    if (leads && leads.length > 0) {
      const leadIds = leads.map((l) => l.id);
      const { data: media, error: mediaError } = await supabase
        .from('lead_media')
        .select('*')
        .in('lead_id', leadIds);

      if (!mediaError && media) {
        media.forEach((m) => {
          if (!mediaMap[m.lead_id]) mediaMap[m.lead_id] = [];
          mediaMap[m.lead_id].push(m);
        });
      }
    }

    // Enrich leads with media
    const enrichedLeads = (leads || []).map((lead) => ({
      ...lead,
      media: mediaMap[lead.id] || [],
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        leads: enrichedLeads,
        count: enrichedLeads.length,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Internal server error', details: error.message }),
    };
  }
};

