const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;

  // Check 1: Credentials exist
  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        issue: 'Missing Supabase credentials',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        urlLength: supabaseUrl?.length || 0,
        keyLength: supabaseKey?.length || 0,
      }),
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Check 2: Can connect
    const { data: tables, error: tableError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    if (tableError) {
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          issue: 'Cannot query leads table',
          error: tableError.message,
          code: tableError.code,
        }),
      };
    }

    // Check 3: Try minimal insert
    const { data: result, error: insertError } = await supabase
      .from('leads')
      .insert({
        customer_name: 'Diagnostic Test',
        customer_email: `diag-${Date.now()}@test.com`,
        zip: '00000',
      })
      .select()
      .single();

    if (insertError) {
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          issue: 'Insert failed',
          error: insertError.message,
          code: insertError.code,
          details: insertError.details,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        status: 'ALL SYSTEMS OK',
        leadCreated: result.id,
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        issue: 'Exception',
        error: error.message,
        stack: error.stack?.substring(0, 200),
      }),
    };
  }
};

