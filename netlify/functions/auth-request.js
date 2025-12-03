const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// Simple email sending (using Supabase's built-in or a free service)
const sendEmail = async (to, subject, html) => {
  // For now, we'll log this. In production, integrate with SendGrid, Resend, etc.
  console.log(`Email to ${to}: ${subject}`);
  console.log(html);
  // TODO: Implement actual email sending
};

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
    const { email } = JSON.parse(event.body);

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Invalid email' }),
      };
    }

    // Find or create professional
    let { data: prof, error: queryError } = await supabase
      .from('professionals')
      .select('*')
      .eq('email', email)
      .single();

    if (queryError && queryError.code !== 'PGRST116') {
      throw queryError;
    }

    if (!prof) {
      // Create new professional
      const { data: newProf, error: createError } = await supabase
        .from('professionals')
        .insert({ email })
        .select()
        .single();

      if (createError) throw createError;
      prof = newProf;
    }

    // Generate magic link token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await supabase.from('auth_tokens').insert({
      professional_id: prof.id,
      token,
      expires_at: expiresAt.toISOString(),
    });

    // Generate login link
    const loginLink = `${process.env.SITE_URL || 'https://estatequoter.com'}/pro-login?token=${token}`;

    // Send email
    await sendEmail(
      email,
      'Your EstateQuoter Pro Login Link',
      `
        <h2>Welcome to EstateQuoter Pro</h2>
        <p>Click the link below to log in and view available leads:</p>
        <a href="${loginLink}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          Log In Now
        </a>
        <p>This link expires in 24 hours.</p>
        <p>Or copy this link: ${loginLink}</p>
      `
    );

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        message: 'Check your email for a login link',
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

