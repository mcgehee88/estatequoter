// EstateQuoter API Client
const API_BASE = window.location.origin;

/**
 * Submit a lead (form submission)
 */
async function submitLead(formData) {
  try {
    const response = await fetch(`${API_BASE}/api/submit-lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit lead');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting lead:', error);
    throw error;
  }
}

/**
 * Request magic link for professional login
 */
async function requestAuthLink(email) {
  try {
    const response = await fetch(`${API_BASE}/api/auth-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send magic link');
    }

    return await response.json();
  } catch (error) {
    console.error('Error requesting auth link:', error);
    throw error;
  }
}

/**
 * Get available leads for a professional
 */
async function getLeads(token) {
  try {
    const response = await fetch(`${API_BASE}/api/get-leads?token=${token}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch leads');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }
}

/**
 * Submit a quote on a lead
 */
async function submitQuote(token, leadId, amount, message = '') {
  try {
    const response = await fetch(`${API_BASE}/api/submit-quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        lead_id: leadId,
        amount,
        message,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit quote');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting quote:', error);
    throw error;
  }
}

/**
 * Get admin statistics
 */
async function getAdminStats(adminToken) {
  try {
    const response = await fetch(`${API_BASE}/api/admin-stats`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
}

