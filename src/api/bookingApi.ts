export async function simulatePayment(bookingId: string, amount: number) {
  try {
    const response = await fetch('/api/payments/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId, amount }),
    });

    if (!response.ok) {
      throw new Error('Payment simulation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error simulating payment:', error);
    throw error;
  }
}
