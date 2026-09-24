import { NextResponse } from 'next/server';
import { adminDb } from '@/database/firebase-admin';

export async function POST(request: Request) {
  try {
    const { tenantId, productId, quantity } = await request.json();

    if (!tenantId || !productId) {
      return NextResponse.json({ error: 'Missing tenantId or productId' }, { status: 400 });
    }

    const storeRef = adminDb.collection('stores').doc(tenantId);
    const storeSnap = await storeRef.get();

    if (!storeSnap.exists) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const store = storeSnap.data();

    if (store.membership_status === 'BLOCKED') {
      return NextResponse.json({ error: 'Store suspended' }, { status: 403 });
    }

    const product = store.products.find((p: any) => p.id === productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const clientId = store.gateways.paypal_client_id;
    const clientSecret = store.gateways.paypal_secret;

    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Payment auth failed' }, { status: 402 });
    }

    const orderRes = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: (product.price * (quantity || 1)).toFixed(2),
          },
          description: product.name,
        }],
      }),
    });

    const orderData = await orderRes.json();

    return NextResponse.json({
      orderID: orderData.id,
      productName: product.name,
      amount: (product.price * (quantity || 1)).toFixed(2),
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
