const { readFile, writeFile, mkdir } = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'leads.json');

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

    // Ensure data directory exists
    try {
      await mkdir(DATA_DIR, { recursive: true });
    } catch (e) {
      // Directory already exists or error
    }

    // Read existing leads
    let leads = [];
    try {
      const data = await readFile(DATA_FILE, 'utf8');
      const parsed = JSON.parse(data);
      leads = parsed.leads || [];
    } catch (e) {
      // File doesn't exist yet
      leads = [];
    }

    // Create new lead
    const newLead = {
      id: crypto.randomUUID(),
      ...body,
      status: 'open',
      archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to leads array
    leads.push(newLead);

    // Write back to file
    await writeFile(DATA_FILE, JSON.stringify({ leads }, null, 2));

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        lead_id: newLead.id,
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
