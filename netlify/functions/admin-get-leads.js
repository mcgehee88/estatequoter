const { createClient } = require('@supabase/supab
[truncated]
   SELECT * FROM leads ORDER BY created_at DESC');
      
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: data || [] }),
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: error.message }),
      };
    }
  } else {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
};

