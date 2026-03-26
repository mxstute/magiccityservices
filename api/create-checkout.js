// /api/create-checkout.js
// Vercel Serverless Function — Creates a Stripe Checkout Session
// Set STRIPE_SECRET_KEY in Vercel Environment Variables

import Stripe from 'stripe';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { packageName, price, customerName, customerEmail, customerPhone, vehicleInfo, date, time, address } = req.body;

    if (!packageName || !price || !customerEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const amountInCents = Math.round(price * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Magic City Detailing — ${packageName}`,
              description: `Deposit for ${packageName}. Vehicle: ${vehicleInfo || 'TBD'}. Date: ${date || 'TBD'} at ${time || 'TBD'}.`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        customerName: customerName || '',
        customerPhone: customerPhone || '',
        vehicleInfo: vehicleInfo || '',
        preferredDate: date || '',
        preferredTime: time || '',
        serviceAddress: address || '',
        package: packageName,
      },
      success_url: `${req.headers.origin || 'https://magiccityservicesmiami.com'}?booking=success&package=${encodeURIComponent(packageName)}`,
      cancel_url: `${req.headers.origin || 'https://magiccityservicesmiami.com'}?booking=cancelled`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}
