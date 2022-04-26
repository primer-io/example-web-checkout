window.addEventListener("load", onLoaded);

async function onLoaded() {
  const clientSession = await fetch('/client-session', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  }).then(response => response.json())

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
      alert(`Checkout Complete! Payment ID: ${payment.id}`)
    },
  })
}
