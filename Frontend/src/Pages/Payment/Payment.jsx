/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// import { server } from './server';
import './Payment.css'; // Import the CSS file

function Payment() {
    const location = useLocation();
    const { amount = 50000, currency = "INR", receiptId = "qwsaq1" } = location.state || {};

    const [loading, setLoading] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState(false); 

    useEffect(() => {
        const loadRazorpayScript = () => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.onload = () => resolve(true);
                script.onerror = () => {
                    console.error('Failed to load Razorpay SDK');   
                    resolve(false);
                };
                document.body.appendChild(script);
            });
        };

        const initiatePayment = async () => {
            setLoading(true);

            try {
                const orderResponse = await fetch('https://vyavastha-backend.onrender.com/pay', {
                    method: "POST",
                    body: JSON.stringify({
                        amount,
                        currency,
                        receipt: receiptId,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const order = await orderResponse.json();
                console.log(order); // Log the order response

                if (order.order && order.order.id) {
                       console.log("VITE_RAZORPAY_KEY_ID:", import.meta.env.VITE_RAZORPAY_KEY_ID);
                    const options = {
                        key: "rzp_test_PXPfjz9pwCHdd0", // Use Vite env
                        amount: order.order.amount,
                        currency,
                        name: "V4Company",
                        description: "Booking Payment",
                        order_id: order.order.id,
                        handler: async (response) => {
                            const verifyResponse = await fetch('https://vyavastha-backend.onrender.com/verify-payment', {
                                method: 'POST',
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature,
                                }),
                            });

                            const verifyResult = await verifyResponse.json();
                            if (verifyResult.success) {
                                setPaymentSuccess(true);
                                alert("Payment successful!"); // Notify the user of success
                                // Redirect or perform additional actions here if needed
                            } else {
                                alert('Payment verification failed!');
                            }
                        },
                        prefill: {
                            name: 'Nandini Patel',
                            email: 'nandinipatel1306@gmail.com',
                            contact: '6268008186',
                        },
                        theme: {
                            color: "#F37254",
                        },
                    };

                    if (window.Razorpay) { // Ensure Razorpay is loaded
                        const rzp1 = new window.Razorpay(options);
                        rzp1.on('payment.failed', (response) => {
                            alert("Payment failed: " + response.error.description);
                        });

                        rzp1.open(); // Open the Razorpay payment dialog
                    } else {
                        console.error('Razorpay SDK not loaded');
                        alert('Razorpay SDK not available. Please refresh the page.');
                    }
                } else {
                    alert('Order creation failed!');
                }
            } catch (error) {
                console.error("Error creating order", error);
                alert("Payment failed");
            } finally {
                setLoading(false);
            }
        };

        loadRazorpayScript().then((loaded) => {
            if (loaded) {
                console.log("Razorpay SDK loaded");
                initiatePayment(); // Automatically initiate payment
            }
        });
    }, [amount, currency, receiptId]); // Ensure to include necessary dependencies

    return (
        <div className="payment-container">
            {loading ? (
                <div className="loader"></div> // Show loader when loading
            ) : (
                <p>Processing your payment...</p>
            )}
        </div>
    );
}

export default Payment;
