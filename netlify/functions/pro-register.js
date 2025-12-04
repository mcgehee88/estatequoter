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
    const required = ['company', 'contactName', 'email', 'phone', 'serviceArea', 'slug'];
    for (const field of required) {
      if (!body[field]) {
        return {
          statusCode: 400,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: `Missing: ${field}` }),
        };
      }
    }

    // Validate slug format (alphanumeric + dashes, lowercase)
    const slug = body.slug.toLowerCase().trim();
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          error: 'Slug can only contain letters, numbers, and dashes',
        }),
      };
    }

    // Check if slug already exists
    const { data: existing, error: checkError } = await supabase
      .from('professionals')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return {
        statusCode: 409,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          error: 'This link is already taken. Please choose another.',
        }),
      };
    }

    // Create professional record
    const { data: professional, error: createError } = await supabase
      .from('professionals')
      .insert({
        slug: slug,
        company_name: body.company,
        contact_name: body.contactName,
        email: body.email,
        phone: body.phone,
        service_area: body.serviceArea,
        status: 'active',
      })
      .select()
      .single();

    if (createError) {
      console.error('DB error:', createError);
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Failed to create professional account' }),
      };
    }

    // Generate pro link
    const proLink = `https://estatequoter.com/?pro=${slug}`;

    // Log to activity
    await supabase.from('activity_log').insert({
      entity_type: 'professional',
      entity_id: professional.id,
      action: 'registered',
      details: {
        company: body.company,
        email: body.email,
        slug: slug,
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
        professional_id: professional.id,
        slug: slug,
        link: proLink,
        message: `Your EstateQuoter Pro link is ready to share!`,
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

