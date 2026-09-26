import { NextResponse } from 'next/server';
import { adminDb } from '@/database/firebase-admin';

export async function POST(request: Request) {
  if (!adminDb) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { tenantId, name, price, imgUrl, description, stock } = await request.json();

    if (!tenantId || !name || price == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = adminDb.collection('stores').doc(tenantId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const data = doc.data() as any;
    const products = data?.products || [];

    // 免费试用限制：最多 5 个商品
    if (data.membership_status !== 'PRO_ACTIVE' && products.length >= 5) {
      return NextResponse.json({
        error: 'Free trial allows up to 5 products. Upgrade to Pro ($19.99/mo) to add more.',
        limitReached: true,
      }, { status: 403 });
    }

    const newProduct = {
      id: 'prod_' + Math.random().toString(36).substring(2, 12),
      name,
      price: parseFloat(price),
      original_price: data.original_price ? parseFloat(data.original_price) : null,
      img_url: imgUrl || '',
      description: description || '',
      stock: stock != null ? parseInt(stock) : 100,
      created_at: new Date().toISOString(),
    };

    await docRef.update({ products: [...products, newProduct] });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error('Add product error:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!adminDb) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { tenantId, productId } = await request.json();

    if (!tenantId || !productId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const docRef = adminDb.collection('stores').doc(tenantId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const data = doc.data() as any;
    const products = (data?.products || []).filter((p: any) => p.id !== productId);

    await docRef.update({ products });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
