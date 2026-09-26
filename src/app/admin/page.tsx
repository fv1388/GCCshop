'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AdminDashboardInner() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('tenantId') || '';

  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  // 添加商品表单
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadStore = useCallback(async () => {
    if (!tenantId) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/store/${tenantId}`);
      const data = await res.json();
      if (data.success) {
        setStore(data.store);
      } else {
        setError(data.error || 'Store not found');
      }
    } catch (err) {
      setError('Failed to load store');
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !price) {
      showToast('⚠️ Product name and price are required');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, name, price, imgUrl, description }),
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setPrice('');
        setImgUrl('');
        setDescription('');
        showToast('✅ Product added successfully');
        await loadStore();
      } else {
        showToast('⚠️ ' + (data.error || 'Failed to add product'));
      }
    } catch (err) {
      showToast('⚠️ Network error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteProduct(productId: string) {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, productId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('🗑️ Product deleted');
        await loadStore();
      } else {
        showToast('⚠️ ' + (data.error || 'Delete failed'));
      }
    } catch (err) {
      showToast('⚠️ Network error');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-zinc-700 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!tenantId) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🔑</div>
          <h1 className="text-2xl font-black">Merchant Login Required</h1>
          <p className="text-zinc-400 text-sm mt-3">
            Open your dashboard by visiting your store URL with the admin path.
            <br />
            <span className="font-mono text-xs bg-black/30 rounded px-2 py-1 inline-block mt-3">
              /admin?tenantId=your_store_id
            </span>
          </p>
          <p className="text-zinc-600 text-xs mt-4">
            New here? Sign up free at cc.get100shop.com to get your store.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-red-900/60 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-black text-red-300">{error}</h1>
          <p className="text-zinc-500 text-xs mt-3">
            Make sure the tenantId in the URL is correct.
          </p>
        </div>
      </div>
    );
  }

  const products = store?.products || [];
  const isFreeTrial = store?.membership_status !== 'PRO_ACTIVE';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-yellow-500/30">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3 text-sm shadow-2xl">
          {toast}
        </div>
      )}

      {/* ===== 顶栏 ===== */}
      <header className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-black tracking-tight">
                {store?.store_name} <span className="text-yellow-400">Admin</span>
              </span>
              <span className="block text-[10px] text-zinc-500">
                {store?.tenant_id}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
              isFreeTrial
                ? 'bg-emerald-950/50 border border-emerald-800/60 text-emerald-400'
                : 'bg-yellow-950/50 border border-yellow-700/60 text-yellow-400'
            }`}>
              {isFreeTrial ? 'Free Trial' : 'Pro'}
            </span>
            <a
              href={`https://${store?.subdomain}.cc.get100shop.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-bold text-zinc-300 hover:text-white transition"
            >
              View Store ↗
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-10">
        {/* ===== 概览卡 ===== */}
        <section className="grid md:grid-cols-3 gap-5 mb-10">
          {[
            ['📦', 'Products', String(products.length)],
            ['💳', 'Plan', isFreeTrial ? 'Free Trial' : 'Pro Active'],
            ['🔗', 'Store URL', `${store?.subdomain}.cc.get100shop.com`],
          ].map(([icon, label, value]) => (
            <div key={label} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-lg">
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</p>
                  <p className="text-sm font-black text-zinc-100 truncate">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ===== 添加商品 ===== */}
        <section className="mb-10">
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black">➕ Add New Product</h2>
              {isFreeTrial && (
                <span className="text-[11px] text-zinc-500">
                  Free trial: up to 5 products · <span className="text-yellow-400 font-bold">Pro: unlimited</span>
                </span>
              )}
            </div>
            <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vintage 90s Phone Case"
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Price (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="19.99"
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Product Image URL</label>
                <input
                  type="url"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  placeholder="https://...jpg"
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition placeholder:text-zinc-600"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short product description for your storefront..."
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition placeholder:text-zinc-600 resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-black px-8 py-3 rounded-xl transition active:scale-[0.99] shadow-xl shadow-yellow-900/30"
                >
                  {submitting ? 'Adding...' : 'Add Product →'}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ===== 商品列表 ===== */}
        <section>
          <h2 className="text-lg font-black mb-5">🛍️ Your Products ({products.length})</h2>
          {products.length === 0 ? (
            <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl p-12 text-center">
              <p className="text-zinc-500 text-sm">No products yet. Add your first product above.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p: any) => (
                <div key={p.id} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl overflow-hidden group">
                  <div className="h-40 bg-zinc-950 flex items-center justify-center overflow-hidden">
                    {p.img_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.img_url} alt={p.name} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <span className="text-4xl opacity-30">📦</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-black text-zinc-100 truncate">{p.name}</h3>
                    <p className="text-[12px] text-zinc-500 mt-1 line-clamp-2 min-h-[2em]">{p.description || 'No description'}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/60">
                      <span className="text-emerald-400 font-mono font-black">
                        ${typeof p.price === 'number' ? p.price.toFixed(2) : p.price}
                      </span>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-[11px] font-bold text-red-400/80 hover:text-red-300 transition px-2 py-1 rounded-lg hover:bg-red-950/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-zinc-700 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <AdminDashboardInner />
    </Suspense>
  );
}
