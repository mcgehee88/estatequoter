const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;
    
    console.log('URL:', url);
    console.log('URL type:', typeof url);
    console.log('URL length:', url?.length);
    
    const supabase = createClient(url, key);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, stack: error.stack }),
    };
  }
};

