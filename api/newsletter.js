export default async function handler(req, res) {
  // Always set Content-Type to application/json
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const SHOP = process.env.SHOP;
  const ACCESS_TOKEN = process.env.ADMIN_API_TOKEN;

  if (!SHOP || !ACCESS_TOKEN) {
    console.error('Newsletter API Error: Missing environment variables', { 
      hasShop: !!SHOP, 
      hasToken: !!ACCESS_TOKEN 
    });
    return res.status(500).json({ 
      success: false, 
      message: 'Server configuration error. Please ensure SHOP and ADMIN_API_TOKEN are set in Vercel environment variables.' 
    });
  }

  try {
    const shopifyResponse = await fetch(`https://${SHOP}/admin/api/2024-01/customers.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN,
      },
      body: JSON.stringify({
        customer: {
          email: email,
          accepts_marketing: true,
          marketing_opt_in_level: 'single_opt_in',
          email_marketing_consent: {
            state: 'subscribed',
            opt_in_level: 'single_opt_in'
          },
          tags: 'newsletter'
        },
      }),
    });

    const data = await shopifyResponse.json();
    console.log('Shopify API Response:', JSON.stringify(data));

    if (shopifyResponse.ok) {
      return res.status(200).json({ success: true, message: 'Customer created successfully' });
    } else {
      // Handle customer already exists error
      if (data.errors && data.errors.email) {
        const isDuplicate = data.errors.email.some(err => 
          err.includes('already been taken') || err.includes('exists')
        );
        if (isDuplicate) {
          return res.status(200).json({ success: true, message: 'Already subscribed' });
        }
      }

      console.error('Shopify Error Data:', data);
      return res.status(200).json({ 
        success: false, 
        message: data.errors ? JSON.stringify(data.errors) : 'Shopify subscription failed',
        error: data
      });
    }
  } catch (error) {
    console.error('Newsletter API Error:', error);
    return res.status(200).json({ 
      success: false, 
      message: error.message || 'Internal server error',
      error: error
    });
  }
}
