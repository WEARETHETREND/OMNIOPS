import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const PRICE_IDS = {
  starter: 'price_1SxHAP6QbLBgtlb8NIVXhubR',
  professional: 'price_1SxHAP6QbLBgtlb8WqvszdOS',
  enterprise: 'price_1SxHAP6QbLBgtlb8u3ALkevK'
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan } = await req.json();
    const priceId = PRICE_IDS[plan];

    if (!priceId) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Create checkout session
    const origin = req.headers.get('origin') || 'https://app.omniops.io';
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=canceled`,
      customer_email: user.email,
      metadata: {
        base44_app_id: Deno.env.get('BASE44_APP_ID'),
        user_id: user.id,
        user_email: user.email,
        plan: plan
      },
      subscription_data: {
        metadata: {
          base44_app_id: Deno.env.get('BASE44_APP_ID'),
          user_id: user.id,
          plan: plan
        }
      }
    });

    return Response.json({ 
      url: session.url,
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});