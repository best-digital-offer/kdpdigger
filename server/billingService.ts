import { db } from './db.ts';
import { PricingPlan } from '../src/types.ts';

export interface CheckoutSessionResult {
  checkoutUrl: string;
  orderId: string;
  planId: string;
  amount: number;
  provider: string;
  status: 'completed' | 'pending';
}

export class BillingService {
  private static instance: BillingService;

  private constructor() {}

  public static getInstance(): BillingService {
    if (!BillingService.instance) {
      BillingService.instance = new BillingService();
    }
    return BillingService.instance;
  }

  /**
   * Generates a checkout or simulation session for purchasing a research access plan.
   * Built as an abstraction layer ready for Stripe, Lemon Squeezy, Paddle, or Dodo Payments.
   */
  async createCheckoutSession(userId: string, planId: string): Promise<CheckoutSessionResult> {
    const plans = await db.getPlans();
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    const settings = await db.getSettings();
    const provider = settings.paymentProvider || 'simulation';
    const orderId = 'ord_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    // In a live integration, here we call stripe.checkout.sessions.create or lemonsqueezy / paddle
    // For immediate seamless customer flow, we support rapid simulated activation & webhook simulation:
    return {
      checkoutUrl: `/checkout/success?order_id=${orderId}&plan_id=${planId}`,
      orderId,
      planId,
      amount: plan.price,
      provider,
      status: 'completed'
    };
  }

  /**
   * Applies credits to user upon successful payment confirmation
   */
  async applyPlanToUser(userId: string, planId: string): Promise<{ success: boolean; newCredits: number; planName: string }> {
    const plans = db.getPlans();
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      throw new Error(`Plan ${planId} does not exist`);
    }

    const updatedUser = await db.addUserCredits(userId, plan.credits, plan.name, plan.durationDays);
    if (!updatedUser) {
      throw new Error('User not found');
    }

    return {
      success: true,
      newCredits: updatedUser.credits,
      planName: plan.name
    };
  }
}

export const billingService = BillingService.getInstance();
