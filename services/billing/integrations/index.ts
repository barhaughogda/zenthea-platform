/**
 * Boundary for payment execution
 * 
 * Stripe is an EXECUTOR, not an authority.
 * This interface defines what we need from a payment provider.
 */
export interface IPaymentProvider {
  /**
   * Create or update a customer in the payment provider
   */
  syncCustomer(tenantId: string, email: string): Promise<string>;

  /**
   * Create a checkout session for a specific plan
   */
  createCheckoutSession(customerId: string, planId: string): Promise<{ url: string }>;

  /**
   * Handle incoming webhooks from the payment provider
   */
  handleWebhook(payload: any, signature: string): Promise<void>;
}

/**
 * Placeholder for Stripe implementation
 */
export class StripeProvider implements IPaymentProvider {
  async syncCustomer(tenantId: string, email: string): Promise<string> {
    throw new Error('Stripe integration not implemented yet');
  }

  async createCheckoutSession(customerId: string, planId: string): Promise<{ url: string }> {
    throw new Error('Stripe integration not implemented yet');
  }

  async handleWebhook(payload: any, signature: string): Promise<void> {
    throw new Error('Stripe integration not implemented yet');
  }
}
