window.addEventListener("load", onLoaded);

async function onLoaded() {
  const clientSession = await fetch('/client-session', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  }).then(data => data.json())

  const { clientToken } = clientSession

  const universalCheckout = await Primer.showUniversalCheckout(clientToken, {
    // Specify the selector of the container element
    container: '#checkout-container',

    /**
     * When the checkout flow has been completed, you'll receive
     * the successful payment via `onCheckoutComplete`.
     * Implement this callback to redirect the user to an order confirmation page and fulfill the order.
     */
    onCheckoutComplete({ payment }) {
      console.log('Checkout Complete!', payment)
    },

    // Other optional options
    style: {
      submitButton: {
        base: {
          color: '#ffffff',
          background: '#000000',
          borderRadius: '8px',
          boxShadow: 'none',
        },
        disabled: {
          color: '#9b9b9b',
          background: '#e1deda',
        },
      },
    },
  })
}
