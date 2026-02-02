import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe@17.5.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET');
      return Response.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // Verify webhook signature
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );

    console.log('Webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { user_email, plan } = session.metadata;

        // Create or update subscription
        const planLimits = {
          starter: { workflows: 25, runs: 5000, users: 10 },
          professional: { workflows: -1, runs: 50000, users: 50 },
          enterprise: { workflows: -1, runs: -1, users: -1 }
        };

        const limits = planLimits[plan] || planLimits.starter;

        await base44.asServiceRole.entities.Subscription.create({
          plan: plan,
          status: 'active',
          price_monthly: session.amount_total / 100,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          workflows_limit: limits.workflows,
          runs_limit_monthly: limits.runs,
          users_limit: limits.users,
          current_period_start: new Date().toISOString(),
          features: {
            ai_copilot: plan !== 'free',
            advanced_analytics: plan === 'professional' || plan === 'enterprise',
            white_label: plan === 'professional' || plan === 'enterprise',
            priority_support: plan === 'professional' || plan === 'enterprise',
            custom_integrations: true,
            audit_logs: plan !== 'starter'
          },
          mrr: session.amount_total / 100
        });

        console.log(`Subscription created for ${user_email} - ${plan} plan`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        // Update subscription status
        const existing = await base44.asServiceRole.entities.Subscription.filter({
          stripe_subscription_id: subscription.id
        });

        if (existing.length > 0) {
          await base44.asServiceRole.entities.Subscription.update(existing[0].id, {
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Mark subscription as canceled
        const existing = await base44.asServiceRole.entities.Subscription.filter({
          stripe_subscription_id: subscription.id
        });

        if (existing.length > 0) {
          await base44.asServiceRole.entities.Subscription.update(existing[0].id, {
            status: 'canceled'
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log(`Payment succeeded for invoice ${invoice.id}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        
        // Update subscription to past_due
        const existing = await base44.asServiceRole.entities.Subscription.filter({
          stripe_subscription_id: invoice.subscription
        });

        if (existing.length > 0) {
          await base44.asServiceRole.entities.Subscription.update(existing[0].id, {
            status: 'past_due'
          });
        }
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 400 });
  }
});