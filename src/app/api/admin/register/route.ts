import { NextResponse } from 'next/server';
import { adminDb } from '@/database/firebase-admin';

export async function POST(request: Request) {
  if (!adminDb) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { email, password, storeName } = await request.json();

    if (!email || !password || !storeName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tenantId = 'store_' + Math.random().toString(36).substring(2, 10);
    const subdomain = storeName.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 100);

    const defaultProducts = [
      {
        id: 'prod_default_1',
        name: 'Vintage 90s Phone Case',
        price: 19.99,
        original_price: 39.99,
        img_url: '',
        description: 'Trendy retro protective case',
        stock: 100,
      },
      {
        id: 'prod_default_2',
        name: 'Wireless Earbuds Pro',
        price: 29.99,
        original_price: 59.99,
        img_url: '',
        description: 'Premium sound, all-day battery',
        stock: 100,
      },
      {
        id: 'prod_default_3',
        name: 'Minimalist Smart Watch',
        price: 49.99,
        original_price: 99.99,
        img_url: '',
        description: 'Your health companion on wrist',
        stock: 100,
      },
    ];

    await adminDb.collection('stores').doc(tenantId).set({
      tenant_id: tenantId,
      store_name: storeName,
      owner_email: email,
      subdomain: subdomain,
      custom_domain: null,
      membership_status: 'FREE_TRIAL',
      trial_started_at: new Date().toISOString(),
      membership_expires_at: null,
      theme: {
        primary_color: '#1a1a2e',
        accent_color: '#e94560',
        logo_url: '',
      },
      gateways: {
        paypal_client_id: '',
        paypal_secret: '',
        paypal_email: '',
      },
      products: defaultProducts,
      shipping: {
        free_shipping_threshold: 0,
        processing_days: '1-2 business days',
        delivery_days: '5-7 business days',
      },
      created_at: new Date().toISOString(),
      status: 'active',
    });

    return NextResponse.json({
      success: true,
      tenantId: tenantId,
      storeUrl: `https://cc.get100shop.com/shop/tenant/${subdomain}`,
    });

  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
