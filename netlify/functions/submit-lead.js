const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  
  // Validate env vars
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials:', { url: !!supabaseUrl, key: !!supabaseKey });
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Missing Supabase configuration' }),
    };
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const body = JSON.parse(event.body);

    // Validate required fields
    const required = ['customer_name', 'customer_email'];
    for (const field of required) {
      if (!body[field]) {
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: `Missing: ${field}` }),
        };
      }
    }

    // Step 1: Look up professional by slug if pro param provided
    let professionalId = null;
    if (body.pro_slug) {
      const { data: professional, error: proError } = await supabase
        .from('professionals')
        .select('id')
        .eq('slug', body.pro_slug.toLowerCase().trim())
        .single();

      if (professional) {
        professionalId = professional.id;
      }
      // If slug not found, continue anyway (lead still created, just unrouted)
    }

    // Step 2: Create lead record with ONLY existing columns
    const { data: lead, error: dbError } = await supabase
      .from('leads')
      .insert({
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone || null,
        zip: body.zip || null,
        notes: body.notes || null,
        status: 'open',
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB error:', dbError);
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Failed to save lead' }),
      };
    }

    // Step 3: Save media records if provided
    if (body.media && Array.isArray(body.media) && body.media.length > 0) {
      const mediaRecords = body.media.map((m) => ({
        lead_id: lead.id,
        cloudinary_url: m.secure_url || m.url,
        cloudinary_public_id: m.public_id,
        media_type: m.resource_type === 'video' ? 'video' : 'image',
      }));

      const { error: mediaError } = await supabase
        .from('lead_media')
        .insert(mediaRecords);

      if (mediaError) {
        console.error('Media save error:', mediaError);
        // Don't fail the lead submission if media fails
      }
    }

    // Step 4: Log activity
    await supabase.from('activity_log').insert({
      entity_type: 'lead',
      entity_id: lead.id,
      action: 'created',
      details: {
        professional_id: professionalId,
        pro_slug: body.pro_slug,
        has_media: body.has_media,
      },
    });

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        lead_id: lead.id,
        professional_id: professionalId,
        message: 'Lead submitted successfully',
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



