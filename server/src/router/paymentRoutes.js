const express = require('express');
const router = express.Router();
const stripe = require('stripe')('');

router.post('/intents', async (req, res) => {
  try {
    //create payment intent
    console.log('amount', req.body.amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    //return the secrete
    res.json({paymentIntent: paymentIntent.client_secret});
  } catch (error) {
    console.log('error');
    res.status(400).json({
      error: error.message,
    });
  }
});

module.exports = router;
