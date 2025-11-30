// Flutterwave Payment Integration
function makePayment(amount, customerEmail, customerName, customerPhone) {
  FlutterwaveCheckout({
    public_key: "FLWPUBK_TEST-ca8f8997f477d526b4167bb9c02a46a5-X",
    tx_ref: "nolaz-" + Date.now(),
    amount: amount,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: customerEmail,
      phone_number: customerPhone,
      name: customerName,
    },
    callback: function (data) {
      console.log(data);
      if (data.status === 'successful') {
        alert('Payment successful! Your order has been placed.');
        // Clear cart after successful payment
        if (window.cart) {
          window.cart.items = [];
          window.cart.saveCart();
          window.cart.updateCartCount();
          window.cart.renderCart();
          window.cart.hideCart();
        }
      }
      // Verify payment on your backend
      verifyPayment(data.transaction_id);
    },
    onclose: function() {
      console.log('Payment cancelled');
    },
    customizations: {
      title: "Nolaz Store",
      description: "Payment for items",
      logo: "https://your-logo-url.com/logo.png",
    },
  });
}

function verifyPayment(transactionId) {
  // Send to your backend for verification
  fetch('/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transaction_id: transactionId
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      alert('Payment successful!');
      // Clear cart and redirect
      localStorage.removeItem('cart');
      window.location.href = 'success.html';
    }
  });
}