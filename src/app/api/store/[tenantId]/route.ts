import { NextResponse } from 'next/server';
import { adminDb } from '@/database/firebase-admin';

export async function GET(
  request: Request,
  { params }: { params: { tenantId: string } }
) {
  if (!adminDb) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const tenantId = params.tenantId;
    const doc = await adminDb.collection('stores').doc(tenantId).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const data = doc.data() as any;
    return NextResponse.json({
      success: true,
      store: {
        tenant_id: data.tenant_id,
        store_name: data.store_name,
        subdomain: data.subdomain,
        custom_domain: data.custom_domain,
        membership_status: data.membership_status,
        products: data.products || [],
        shipping: data.shipping || null,
      },
    });
  } catch (error: any) {
    console.error('Get store error:', error);
    return NextResponse.json({ error: 'Failed to load store' }, { status: 500 });
  }
}
