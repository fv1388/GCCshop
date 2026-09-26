'use client';

import { useEffect, useState } from 'react';

export default function TenantShopPage({ params }: { params: { tenantId: string } }) {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/store/${params.tenantId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStore(data.store);
        else setStore({ notFound: true });
      })
      .catch(() => setStore({ notFound: true }))
      .finally(() => setLoading(false));
  }, [params.tenantId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-zinc-700 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400 text-sm">Loading store...</p>
        </div>
      </div>
    );
  }

  if (store?.notFound) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🏪</div>
          <h1 className="text-xl font-black">Store Not Found</h1>
          <p className="text-zinc-500 text-xs mt-3">This store does not exist or is not active.</p>
        </div>
      </div>
    );
  }

  const products = store?.products || [];
  const storeName = store?.store_name || 'My Store';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-yellow-500/30">
      {/* ===== 店铺顶栏 ===== */}
      <header className="border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <span className="text-sm font-black tracking-tight">{storeName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-zinc-500 hidden sm:block">
              Free shipping · 30-day returns
            </span>
            <a
              href="#products"
              className="bg-yellow-500 hover:bg-yellow-400 text-black text-[12px] font-black px-4 py-2 rounded-xl transition"
            >
              Shop Now
            </a>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.07),transparent_55%)]" />
        </div>
        <div className="max-w-6xl mx-auto px-5 py-16 text-center relative">
          <span className="text-[11px] font-black uppercase tracking-widest text-yellow-400">
            Welcome to
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-2">
            {storeName}
          </h1>
          <p className="text-zinc-400 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Hand-picked products, fast global shipping. Every order backed by our 30-day money-back guarantee.
          </p>
        </div>
      </section>

      {/* ===== 商品网格 ===== */}
      <main id="products" className="max-w-6xl mx-auto px-5 pb-20 scroll-mt-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black">All Products ({products.length})</h2>
          <span className="text-[11px] text-zinc-500">Secure PayPal Checkout</span>
        </div>

        {products.length === 0 ? (
          <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-2xl p-12 text-center">
            <p className="text-zinc-500 text-sm">New products are coming soon. Check back shortly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p: any) => (
              <div key={p.id} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-yellow-500/40 transition-all duration-300 flex flex-col">
                <div className="aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden">
                  {p.img_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.img_url}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-5xl opacity-30">📦</span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-[13px] font-black text-zinc-100 line-clamp-2 min-h-[2.4em]">{p.name}</h3>
                  <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 flex-1">{p.description || ''}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/60">
                    <div>
                      {p.original_price && (
                        <span className="text-[10px] text-zinc-500 line-through block">
                          ${typeof p.original_price === 'number' ? p.original_price.toFixed(2) : p.original_price}
                        </span>
                      )}
                      <span className="text-emerald-400 font-mono font-black text-sm">
                        ${typeof p.price === 'number' ? p.price.toFixed(2) : p.price}
                      </span>
                    </div>
                    <button
                      className="bg-zinc-100 hover:bg-white text-zinc-950 text-[11px] font-black px-3.5 py-2 rounded-xl uppercase tracking-wide transition active:scale-95"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ===== 页脚 ===== */}
      <footer className="border-t border-zinc-800/60 bg-zinc-950/80">
        <div className="max-w-6xl mx-auto px-5 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <span className="text-[13px] font-black">{storeName}</span>
          </div>
          <p className="text-[11px] text-zinc-600">
            © {new Date().getFullYear()} {storeName} · Powered by 100Shop Platform
          </p>
          <div className="flex gap-5 text-[11px] text-zinc-500">
            <span>Shipping Policy</span>
            <span>Returns</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
