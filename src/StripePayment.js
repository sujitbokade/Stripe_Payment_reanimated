import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';

const StripePayment = () => {
  const createPaymentIntent = async params => {
    console.log('params', params);

    try {
      const response = await fetch(
        'http://192.168.0.95:3000/payments/intents',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating Payment Intent:', errorData);
        throw new Error(
          `HTTP error! Status: ${response.status}, Details: ${JSON.stringify(
            errorData,
          )}`,
        );
      }

      const data = await response.json();
      console.log('Payment Intent created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating Payment Intent:', error);
      throw error;
    }
  };

  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const onCheckout = async () => {
    // 1. Create a payment intent
    const res = await createPaymentIntent({amount: 500 * 100});
    console.log('res=========<', res);
    if (res.error) {
      Alert.alert('something went wrong1');
      return;
    }
    // 2. Initialize the Payment sheet
    const initResponse = await initPaymentSheet({
      merchantDisplayName: 'card payment',
      paymentIntentClientSecret: res.paymentIntent,
      allowsDelayedPaymentMethods: true,
    });
    console.log('initResponse', initResponse);
    if (initResponse.error) {
      console.log(initResponse.error);
      return;
    }
    // 3. Present the Payment Sheet from Stripe
    const paymentRes = await presentPaymentSheet();
    console.log('paymentRes', paymentRes);
    // 4. If payment ok -> create the order
  };
  return (
    <StripeProvider publishableKey="pk_test_51OUQLmSDV87oTqW9bqejT3c3u7QoLcfBeqCED20y53oGLYXZnqbzgHWyM7KpyaeLb2CNBeLoAh4LE3UACY00NWU3LB9q">
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button title={'Payment'} onPress={onCheckout} />
      </View>
    </StripeProvider>
  );
};

export default StripePayment;

const styles = StyleSheet.create({});
