/**
 * Stripe Error Handler
 * Maps Stripe error codes to user-friendly error messages
 * Handles only the test cards used in the project
 */

export const getStripeErrorMessage = (error) => {
  if (!error) return 'Payment failed. Please try again.';

  // Stripe error code mappings for test cards in use
  const errorMessages = {
    // Card declined (generic) - STRIPE_TEST_CARD_DECLINED
    'card_declined': 'Your card was declined. Please try a different card.',
    
    // Insufficient funds - STRIPE_TEST_CARD_INSUFFICIENT_FUNDS
    'insufficient_funds': 'Insufficient funds. Please use a different payment method.',
    
    // Expired card - STRIPE_TEST_CARD_EXPIRED
    'expired_card': 'Your card has expired. Please use a different card.',
    
    // Incorrect CVC - STRIPE_TEST_CARD_CVC_FAIL
    'incorrect_cvc': 'Your card security code is incorrect. Please check and try again.',
    
    // 3D Secure required - STRIPE_TEST_CARD_3DS_REQUIRED
    'authentication_required': 'Additional authentication is required. Please complete 3D Secure verification.',
    
    // Generic fallback
    'generic_error': 'Payment failed. Please try again or use a different payment method.',
  };

  // Check for specific error code
  if (error.code && errorMessages[error.code]) {
    return errorMessages[error.code];
  }

  // Check for error type
  if (error.type) {
    const typeMessages = {
      'CardError': error.message || 'Card error occurred.',
      'InvalidRequestError': error.message || 'Invalid payment request.',
      'APIConnectionError': 'Network error. Please check your connection.',
      'APIError': 'Payment processing error. Please try again.',
      'AuthenticationError': 'Authentication failed. Please try again.',
    };
    
    if (typeMessages[error.type]) {
      return typeMessages[error.type];
    }
  }

  // Fallback to Stripe's message or generic message
  return error.message || 'Payment failed. Please try again.';
};

/**
 * Check if error is recoverable (user can retry)
 */
export const isRecoverableError = (error) => {
  if (!error) return false;
  
  const recoverableCodes = [
    'api_connection_error',
    'api_error',
    'authentication_required',
  ];
  
  return recoverableCodes.includes(error.code);
};

/**
 * Check if error requires user action (different card, etc.)
 */
export const requiresUserAction = (error) => {
  if (!error) return false;
  
  const actionRequiredCodes = [
    'card_declined',
    'insufficient_funds',
    'expired_card',
    'incorrect_cvc',
  ];
  
  return actionRequiredCodes.includes(error.code);
};
