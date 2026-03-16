const { readFile, writeFile, mkdir } = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const DATA_DIR = path.join(process.cwd(), 'data');
const PROS_FILE = path.join(DATA_DIR, 'professionals.json');

exports.handler = async (event) => {
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
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
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

    // Validate slug format
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

    // Ensure data directory exists
    try {
      await mkdir(DATA_DIR, { recursive: true });
    } catch (e) {
      // Directory already exists
    }

    // Read existing professionals
    let professionals = [];
    try {
      const data = await readFile(PROS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      professionals = parsed.professionals || [];
    } catch (e) {
      professionals = [];
    }

    // Check if slug already exists
    const existing = professionals.find(p => p.slug === slug);
    if (existing) {
      return {
        statusCode: 409,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          error: 'This link is already taken. Please choose another.',
        }),
      };
    }

    // Create new professional
    const newPro = {
      id: crypto.randomUUID(),
      slug: slug,
      company_name: body.company,
      contact_name: body.contactName,
      email: body.email,
      phone: body.phone,
      service_area: body.serviceArea,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    professionals.push(newPro);
    await writeFile(PROS_FILE, JSON.stringify({ professionals }, null, 2));

    // Generate pro link
    const proLink = `https://estatequoter.com/?pro=${slug}`;

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        professional_id: newPro.id,
        slug: slug,
        link: proLink,
        message: 'Your EstateQuoter Pro link is ready to share!',
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
