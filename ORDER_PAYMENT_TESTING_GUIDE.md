# Order and Payment Flow - Manual Testing Guide

This guide provides step-by-step instructions for manually testing the order and payment flow when the backend is available. The E2E tests have been implemented with expected flow logic, but manual testing is recommended for final validation.

## Prerequisites

- Backend server is running and accessible
- Frontend development server is running (`npm run dev`)
- Test user account with credentials: `john.doe@example.com` / `password123`
- Stripe test mode enabled (for credit card testing)

## Test Environment Setup

1. **Start Backend Server**
   ```bash
   # Ensure your backend is running on the configured port
   # Check .env for API URLs
   ```

2. **Start Frontend Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - Navigate to `http://localhost:5173`
   - Open DevTools (F12) for network monitoring

---

## Cash on Delivery Flow

### Test Case: TC-CASH-001
**Add items to cart and place order with Cash on Delivery**

**Steps:**
1. Login with test credentials
2. Navigate to Menu page
3. Add at least one item to cart
4. Navigate to Cart page (`/cart`)
5. Click "Checkout" button
6. Verify checkout page loads with order summary
7. Click "Checkout" button to proceed to payment
8. Select "Cash on Delivery" payment method
9. Click "Place Order" button
10. Verify order confirmation page loads (`/thanks`)

**Expected Results:**
- Cart page displays added items
- Checkout page shows order summary with correct totals
- Payment page shows payment method selection
- Cash on Delivery option is selectable
- Place Order button is enabled after selecting payment method
- Order confirmation page shows:
  - "Thank you" message with user name
  - Order number
  - Order details (items, total)
  - "Continue Browsing" button

**API Verification:**
- Monitor Network tab in DevTools
- Verify `POST /api/orders` request is sent
- Request payload should include:
  ```json
  {
    "items": [
      {
        "mealId": 123,
        "quantity": 1
      }
    ],
    "points": 0,
    "paymentMethod": "CASH"
  }
  ```
- Response should include:
  ```json
  {
    "id": 12345,
    "status": "PENDING",
    "clientId": 1,
    "totalPrice": 25.50,
    "items": [...]
  }
  ```

### Test Case: TC-CASH-002
**Verify placeOrder API is triggered for Cash payment**

**Steps:**
1. Follow steps 1-9 from TC-CASH-001
2. Monitor Network tab before clicking "Place Order"
3. Click "Place Order"
4. Check Network tab for API calls

**Expected Results:**
- `POST /api/orders` request is made
- Request method is POST
- Request contains order payload
- No Stripe-related API calls are made

### Test Case: TC-CASH-003
**Verify no Stripe flow is initiated for Cash payment**

**Steps:**
1. Follow steps 1-9 from TC-CASH-001
2. Monitor Network tab for Stripe-related calls
3. Verify no Stripe modal appears

**Expected Results:**
- No calls to Stripe API
- No Stripe payment modal appears
- Order completes without Stripe interaction

---

## Credit Card / Stripe Flow

### Test Case: TC-STRIPE-001
**Select Credit Card and trigger placeOrder with client secret**

**Steps:**
1. Login with test credentials
2. Add items to cart
3. Navigate to Cart → Checkout → Payment
4. Select "Credit Card" payment method
5. Click "Continue to Payment" button
6. Monitor Network tab

**Expected Results:**
- `POST /api/orders` request is sent
- Response includes `stripeClientSecret`
- Response includes `stripePaymentIntentId`
- Response status is `PENDING` or `AWAITING_PAYMENT`
- Stripe payment modal appears

**API Verification:**
```json
// Request
{
  "items": [...],
  "points": 0,
  "paymentMethod": "CREDIT_CARD"
}

// Response
{
  "id": 12345,
  "status": "PENDING",
  "stripeClientSecret": "pi_test_12345_secret_67890",
  "stripePaymentIntentId": "pi_test_12345",
  "clientId": 1
}
```

### Test Case: TC-STRIPE-002
**Stripe payment form appears after order creation**

**Steps:**
1. Follow steps 1-5 from TC-STRIPE-001
2. Verify Stripe modal appears

**Expected Results:**
- Modal with title "Enter Card Details" appears
- Stripe card input fields are visible
- "Confirm Card Payment" button is present
- Modal can be closed with X button

### Test Case: TC-STRIPE-003
**Order confirmation after successful payment**

**Steps:**
1. Follow steps 1-5 from TC-STRIPE-001
2. Enter valid Stripe test card details:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - Zip: Any 5 digits
3. Click "Confirm Card Payment"
4. Monitor Network tab

**Expected Results:**
- Stripe payment is processed
- Order status updates to `CONFIRMED` or `PAID`
- User is redirected to `/thanks` page
- Order confirmation shows order details

**API Verification:**
- Stripe API call is made
- Order status polling occurs (`GET /api/orders/{id}`)
- Final order status is `CONFIRMED`

---

## Loyalty Points and Voucher Rules

### Test Case: TC-VOUCHER-001
**Voucher selection hidden for users with < 100 points**

**Steps:**
1. Create/test with user having < 100 loyalty points
2. Add items to cart
3. Navigate to Checkout page
4. Check for "Available Discounts" section

**Expected Results:**
- Voucher selection section is NOT visible
- No discount options are shown
- Order proceeds without discount option

### Test Case: TC-VOUCHER-002
**Voucher selection available for users with >= 100 points**

**Steps:**
1. Login with user having >= 100 loyalty points (test user has 1000)
2. Add items to cart
3. Navigate to Checkout page
4. Check for "Available Discounts" section

**Expected Results:**
- "Available Discounts" section is visible
- Shows user's current points balance
- Displays available vouchers:
  - 10% OFF (requires 100 points)
  - 20% OFF (requires 200 points)
  - 30% OFF (requires 300 points)
- Locked vouchers show lock icon
- Unlocked vouchers show checkmark when selected

### Test Case: TC-VOUCHER-003
**Selected voucher included in order request**

**Steps:**
1. Login with user having sufficient points
2. Add items to cart
3. Navigate to Checkout page
4. Select a voucher (e.g., 10% OFF)
5. Proceed to payment
6. Monitor Network tab for order request

**Expected Results:**
- Voucher selection shows "Applied" badge
- Success banner shows discount percentage and points redeemed
- Order request includes `points` field
- `points` value matches voucher requirement (e.g., 100 for 10% off)

**API Verification:**
```json
{
  "items": [...],
  "points": 100,
  "paymentMethod": "CASH"
}
```

---

## Error Handling

### Test Case: TC-ERROR-001
**Empty cart validation**

**Steps:**
1. Login with test credentials
2. Navigate directly to `/cart` (without adding items)
3. Observe page behavior

**Expected Results:**
- Either redirects to home page
- OR shows "Your cart is empty" message
- No checkout options are available

### Test Case: TC-ERROR-002
**Payment method selection validation**

**Steps:**
1. Add items to cart
2. Navigate to Payment page
3. Try to submit without selecting payment method
4. Observe button state and error messages

**Expected Results:**
- "Place Order" / "Continue to Payment" button is disabled
- OR button is enabled but shows error on click
- Error message indicates payment method must be selected

### Test Case: TC-ERROR-003
**Network failure handling**

**Steps:**
1. Add items to cart
2. Navigate to Payment page
3. Select payment method
4. Disable network connection (DevTools → Network tab → Offline)
5. Click "Place Order"
6. Re-enable network

**Expected Results:**
- Error message is displayed
- Error message is user-friendly (not technical)
- User can retry after network is restored
- No false success message is shown

### Test Case: TC-ERROR-004
**Payment failure handling**

**Steps:**
1. Add items to cart
2. Navigate to Payment page
3. Select Credit Card
4. Enter invalid Stripe test card:
   - Card number: `4000 0000 0000 0002` (declined)
5. Click "Confirm Card Payment"

**Expected Results:**
- Stripe error message is displayed
- Order is not confirmed
- User can retry with different card
- Error message explains the failure reason

### Test Case: TC-ERROR-005
**Order creation failure**

**Steps:**
1. Add items to cart
2. Navigate to Payment page
3. Select payment method
4. Monitor Network tab
5. Simulate backend error (use DevTools to intercept request)

**Expected Results:**
- Error message is displayed
- User remains on payment page
- Cart items are preserved
- User can retry order submission

---

## Order History

### Test Case: TC-HISTORY-001
**Order appears in order history after successful order**

**Steps:**
1. Complete a successful order (Cash or Credit Card)
2. Navigate to Profile → Orders (`/profile/orders`)
3. Wait for orders to load

**Expected Results:**
- Order appears in order history
- Order shows correct order ID
- Order shows correct status
- Order shows correct total amount
- Order shows date/time
- Order items are listed

### Test Case: TC-HISTORY-002
**Order details are correctly displayed**

**Steps:**
1. Navigate to Profile → Orders
2. Click on an order to view details
3. Verify all information is correct

**Expected Results:**
- Order ID is displayed
- Order status is displayed with appropriate styling
- Total amount is displayed
- Payment method is shown
- Order items with quantities are shown
- Delivery address (if applicable) is shown
- Order date/time is shown

---

## Order Tracking

### Test Case: TC-TRACKING-001
**Order appears in tracking screen**

**Steps:**
1. Navigate to Profile page
2. Look for order tracking section
3. Verify tracking information is displayed

**Expected Results:**
- Active order is shown in tracking section
- Order status is displayed
- Estimated delivery time (if available)
- Progress indicator (if implemented)

### Test Case: TC-TRACKING-002
**Order status updates correctly**

**Steps:**
1. Place an order
2. Monitor order status over time
3. Check if status updates in UI

**Expected Results:**
- Status changes from PENDING → CONFIRMED → PREPARING → READY → DELIVERED
- Each status update is reflected in UI
- Status is color-coded appropriately
- Status changes happen in real-time (if WebSocket enabled)

---

## Order Cancellation

### Test Case: TC-CANCEL-001
**Cancel order from tracking page**

**Steps:**
1. Place an order with status that allows cancellation (PENDING, CONFIRMED)
2. Navigate to Profile → Orders
3. Find the order
4. Click "Cancel" button
5. Confirm cancellation in modal (if shown)
6. Verify order status changes

**Expected Results:**
- Cancel button is visible for cancellable orders
- Confirmation modal appears
- After confirmation, order status changes to "CANCELED"
- Order is removed from active tracking
- Order remains in history with CANCELED status

### Test Case: TC-CANCEL-002
**Cancellation only allowed for cancellable orders**

**Steps:**
1. Check orders with different statuses:
   - PENDING (should be cancellable)
   - CONFIRMED (should be cancellable)
   - PREPARING (should NOT be cancellable)
   - READY (should NOT be cancellable)
   - DELIVERED (should NOT be cancellable)
2. Verify cancel button visibility/state

**Expected Results:**
- Cancel button is visible for PENDING and CONFIRMED
- Cancel button is hidden or disabled for PREPARING, READY, DELIVERED
- Appropriate error message if user tries to cancel non-cancellable order
- Business rules are enforced correctly

---

## Edge Cases and Additional Tests

### Test Case: TC-EDGE-001
**Maximum quantity validation**

**Steps:**
1. Add an item to cart
2. Try to increase quantity beyond maximum (10)
3. Verify error message

**Expected Results:**
- Error message appears when trying to exceed max quantity
- Quantity is capped at maximum
- User is informed of the limit

### Test Case: TC-EDGE-002
**Order total validation**

**Steps:**
1. Add items to cart totaling > $10,000
2. Try to place order
3. Verify error handling

**Expected Results:**
- Error message appears for orders exceeding $10,000
- Order submission is blocked
- User is informed of the limit

### Test Case: TC-EDGE-003
**Duplicate order prevention**

**Steps:**
1. Place an order successfully
2. Immediately try to place the same order again
3. Verify error handling

**Expected Results:**
- Error message appears for duplicate order
- User is informed they just placed this order
- Order submission is blocked

### Test Case: TC-EDGE-004
**Session expiration handling**

**Steps:**
1. Add items to cart
2. Wait for session to expire (or clear localStorage)
3. Try to place order
4. Verify error handling

**Expected Results:**
- User is redirected to login
- Cart items may be preserved (depending on implementation)
- User can login and complete order

---

## Network Monitoring

During all tests, monitor the Network tab in DevTools to verify:

### Expected API Endpoints

**Authentication:**
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

**Orders:**
- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order details
- `GET /api/orders/client/history` - Get order history
- `PATCH /api/orders/{id}` - Cancel order

**Profile:**
- `GET /api/clients/profile/{id}` - Get user profile
- `PUT /api/clients/profile/{id}` - Update profile

**Menu:**
- `GET /menu` - Get menu items
- `GET /menu/recommendations/{id}` - Get recommendations

### Request/Response Validation

For each API call, verify:
- Correct HTTP method is used
- Request headers include Authorization (if authenticated)
- Request payload matches expected structure
- Response status code is appropriate
- Response body contains expected fields
- Error responses have meaningful messages

---

## Test Data

### Test User Credentials
- Email: `john.doe@example.com`
- Password: `password123`
- Loyalty Points: 1000 (for voucher testing)

### Stripe Test Cards
- **Success:** `4242 4242 4242 4242`
- **Declined:** `4000 0000 0000 0002`
- **Insufficient Funds:** `4000 0025 0000 3155`
- **Expired:** `4000 0000 0000 0069`

---

## Known Limitations

1. **Backend Availability:** Tests assume backend is running and accessible
2. **Stripe Test Mode:** Credit card tests require Stripe test mode
3. **Real-time Updates:** Order tracking may require WebSocket implementation
4. **Email Verification:** Order confirmation emails may not be sent in test environment

---

## Troubleshooting

### Backend Connection Issues
- Verify backend is running
- Check API URLs in `.env` file
- Check CORS configuration
- Verify network connectivity

### Stripe Issues
- Verify Stripe publishable key is configured
- Check Stripe account is in test mode
- Verify Stripe elements are properly initialized
- Check browser console for Stripe errors

### State Management Issues
- Clear localStorage and retry
- Check Zustand persist configuration
- Verify store hydration
- Check for conflicting state updates

---

## Success Criteria

All test cases should pass with the following outcomes:

✅ All user flows complete successfully
✅ API requests match expected structure
✅ Error handling is user-friendly
✅ Business rules are enforced
✅ No false success messages
✅ Order history is accurate
✅ Order tracking works correctly
✅ Cancellation rules are enforced
✅ Payment processing works for both methods
✅ Voucher system works correctly

---

## Next Steps After Testing

1. Document any issues found
2. Create bug tickets for failures
3. Update test cases based on findings
4. Implement fixes for identified issues
5. Re-test after fixes
6. Update this guide with any changes
