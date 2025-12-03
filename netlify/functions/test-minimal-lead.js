const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Missing config', url: !!supabaseUrl, key: !!supabaseKey }),
    };
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test with ONLY required columns that definitely exist
    const { data: lead, error: dbError } = await supabase
      .from('leads')
      .insert({
        customer_name: 'Test Lead',
        customer_email: 'test@example.com',
        zip: '45252',
      })
      .select();

    if (dbError) {
      console.error('DB Error:', JSON.stringify(dbError));
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'DB Error', details: dbError.message }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, lead }),
    };
  } catch (error) {
    console.error('Exception:', error.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};

