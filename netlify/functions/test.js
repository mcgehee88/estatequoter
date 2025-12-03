const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  try {
    const url = 'https://dzqjvsabwijgwbhfjzqq.supabase.co';
    const key = 'sb_secret_QovMs9AGtFX5D_Jc7RFL5Q_z4ozbDEx';
    
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
