const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { token, lead_id, amount, message } = JSON.parse(event.body);

    if (!token || !lead_id || !amount) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          error: 'Missing required fields',
        }),
      };
    }

    // Verify token and get professional ID
    const { data: authToken, error: tokenError } = await supabase
      .from('auth_tokens')
      .select('professional_id, expires_at')
      .eq('token', token)
      .single();

    if (tokenError || !authToken) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
    }

    if (new Date(authToken.expires_at) < new Date()) {
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Token expired' }),
      };
    }

    const professional_id = authToken.professional_id;

    // Check if professional already quoted this lead
    const { data: existing } = await supabase
      .from('quotes')
      .select('id')
      .eq('lead_id', lead_id)
      .eq('professional_id', professional_id)
      .single();

    if (existing) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          error: 'You have already quoted this lead',
        }),
      };
    }

    // Insert quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        lead_id,
        professional_id,
        amount: parseFloat(amount),
        message: message || null,
      })
      .select();

    if (quoteError) throw quoteError;

    // Log activity
    await supabase.from('activity_log').insert({
      entity_type: 'quote',
      entity_id: quote[0].id,
      action: 'created',
      details: { lead_id, professional_id, amount },
    });

    return {
      statusCode: 201,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        quote_id: quote[0].id,
        message: 'Quote submitted successfully',
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

