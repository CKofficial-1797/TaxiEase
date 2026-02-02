import Razorpay from 'razorpay';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;

// Helper function to create Razorpay order
export async function createRazorpayOrder(amount, currency = 'INR', receipt = null) {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        source: 'travel-agency-booking'
      }
    };

    const order = await razorpay.orders.create(options);
    return {
      success: true,
      order: order
    };
  } catch (error) {
    console.error('❌ Razorpay order creation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper function to verify payment signature
export async function verifyPaymentSignature(orderId, paymentId, signature) {
  try {
    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('❌ Payment signature verification error:', error);
    return false;
  }
}

// Helper function to capture payment
export async function capturePayment(paymentId, amount) {
  try {
    const payment = await razorpay.payments.capture(paymentId, amount * 100);
    return {
      success: true,
      payment: payment
    };
  } catch (error) {
    console.error('❌ Payment capture error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper function to create refund
export async function createRefund(paymentId, amount, notes = {}) {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Amount in paise
      notes: {
        reason: notes.reason || 'Customer request',
        ...notes
      }
    });
    return {
      success: true,
      refund: refund
    };
  } catch (error) {
    console.error('❌ Refund creation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
