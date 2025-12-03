const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

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
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);

    const required = ['customer_name', 'customer_email', 'property_type', 'estate_location'];
    for (const field of required) {
      if (!body[field]) {
        return { statusCode: 400, body: JSON.stringify({ error: `Missing: ${field}` }) };
      }
    }

    const { data: lead, error: dbError } = await supabase
      .from('leads')
      .insert({
        customer_name: body.customer_name,
        customer_email: body.customer_email,
        customer_phone: body.customer_phone || null,
        property_type: body.property_type,
        property_value_range: body.property_value_range || null,
        estate_location: body.estate_location,
        urgency: body.urgency || null,
        notes: body.notes || null,
        referral_source: body.referral_source || 'organic',
      })
      .select();

    if (dbError) {
      console.error('DB error:', dbError);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to save lead' }) };
    }

    await supabase.from('activity_log').insert({
      entity_type: 'lead',
      entity_id: lead[0].id,
      action: 'created',
      details: body,
    });

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        lead_id: lead[0].id,
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

