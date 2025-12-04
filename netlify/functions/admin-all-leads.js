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
        'Access-Control-Allow-Headers': 'Content-Type',
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
    // Fetch ALL leads (admin view)
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (leadsError) throw leadsError;

    // Fetch all media
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

    // Fetch professional names for leads
    let proMap = {};
    const uniqueProIds = [...new Set((leads || [])
      .map((l) => l.professional_id)
      .filter((id) => id))];

    if (uniqueProIds.length > 0) {
      const { data: professionals, error: proError } = await supabase
        .from('professionals')
        .select('id, company_name, slug')
        .in('id', uniqueProIds);

      if (!proError && professionals) {
        professionals.forEach((p) => {
          proMap[p.id] = { company_name: p.company_name, slug: p.slug };
        });
      }
    }

    // Enrich leads with media + pro info
    const enrichedLeads = (leads || []).map((lead) => ({
      ...lead,
      media: mediaMap[lead.id] || [],
      professional: lead.professional_id ? proMap[lead.professional_id] : null,
      lead_source: lead.professional_id ? 'pro' : 'organic',
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

