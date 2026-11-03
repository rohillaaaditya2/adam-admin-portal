import { post, api } from './api';

export interface PaymentGatewayConfig {
  configured: boolean;
  keyId: string;
  currency: string;
  gateway: string;
  testMode: boolean;
}

export interface PaymentInitiationParams {
  planId?: string;
  boostTier?: 'standard_199' | 'priority_299';
  couponCode?: string;
  title?: string;
  userPhone?: string;
  userName?: string;
  userEmail?: string;
  onSuccess: (result: any) => void;
  onError: (errorMsg: string) => void;
  onOpenSimulator?: (
    orderData: any,
    proceedSimulatedPay: () => Promise<void>,
    failSimulatedPay: (reason?: string) => Promise<void>
  ) => void;
}

/**
 * Dynamically loads Razorpay checkout.js script if not already present
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Fetches public payment gateway status
 */
export async function getPaymentConfig(): Promise<PaymentGatewayConfig> {
  try {
    return await api<PaymentGatewayConfig>('/payments/config');
  } catch {
    return {
      configured: false,
      keyId: '',
      currency: 'INR',
      gateway: 'razorpay',
      testMode: true
    };
  }
}

/**
 * Plug-and-play payment initiation function.
 * If live Razorpay API keys are configured, it opens the official Razorpay Checkout popup.
 * Simulation is allowed only in development; production requires configured Razorpay keys.
 */
export async function initiatePayment(params: PaymentInitiationParams) {
  const { planId, boostTier, couponCode, title, userPhone, userName, userEmail, onSuccess, onError, onOpenSimulator } = params;

  try {
    // 1. Create order on server
    const orderData: any = await post('/me/razorpay/order', { planId, boostTier, couponCode });
    if (!orderData?.orderId) {
      throw new Error('Could not initialize gateway order');
    }

    const isLive = !orderData.isSimulator && orderData.keyId && !orderData.keyId.includes('simulator') && !orderData.keyId.includes('placeholder');

    if (isLive) {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !(window as any).Razorpay) {
        throw new Error('Razorpay SDK could not be loaded. Please check internet connection.');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Adam N Eve Matrimony',
        description: orderData.title || title || 'Secure Membership & Matchmaking',
        order_id: orderData.orderId,
        prefill: {
          name: userName || 'Member',
          contact: userPhone || '',
          email: userEmail || ''
        },
        theme: {
          color: '#c2185b'
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await post('/me/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            onSuccess(verifyRes);
          } catch (err: any) {
            onError(err.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: async function () {
            try {
              await post('/me/razorpay/fail', {
                razorpay_order_id: orderData.orderId,
                reason: 'Checkout closed by customer'
              });
            } catch {}
            onError('Checkout closed. You can retry payment at any time.');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', async function (response: any) {
        const errMsg = response.error?.description || 'Payment was declined by your bank';
        try {
          await post('/me/razorpay/fail', {
            razorpay_order_id: orderData.orderId,
            reason: errMsg
          });
        } catch {}
        onError(`Payment failed: ${errMsg}. Please try another UPI app or card.`);
      });
      rzp.open();
    } else {
      if (process.env.NODE_ENV === 'production') throw new Error('Online payments are unavailable until the real payment gateway is configured.');
      // Development-only simulator fallback flow:
      const proceedSimulatedPay = async () => {
        try {
          const verifyRes = await post('/me/razorpay/verify', {
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_signature: 'simulated_test_signature'
          });
          onSuccess(verifyRes);
        } catch (err: any) {
          onError(err.message || 'Simulated payment failed');
        }
      };

      const failSimulatedPay = async (reason = 'Simulated bank decline: insufficient balance / wrong PIN') => {
        try {
          await post('/me/razorpay/fail', {
            razorpay_order_id: orderData.orderId,
            reason
          });
        } catch {}
        onError(`Payment declined: ${reason}. Your account was not charged.`);
      };

      if (typeof onOpenSimulator === 'function') {
        onOpenSimulator(orderData, proceedSimulatedPay, failSimulatedPay);
      } else {
        // Direct auto-confirm if no modal handler attached
        await proceedSimulatedPay();
      }
    }
  } catch (err: any) {
    onError(err.message || 'Payment initiation failed');
  }
}
