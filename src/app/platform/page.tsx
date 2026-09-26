'use client';

import { useState } from 'react';

export default function PlatformPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; storeUrl?: string; tenantId?: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, storeName }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({
          success: true,
          message: 'Your store is ready!',
          storeUrl: data.storeUrl,
          tenantId: data.tenantId,
        });
      } else {
        setResult({ success: false, message: data.error || 'Registration failed' });
      }
    } catch (err) {
      setResult({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-yellow-500/30 overflow-x-hidden">
      {/* ===== 背景装饰：径向光晕 + 网格纹理 ===== */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.07),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      {/* ===== 导航栏 ===== */}
      <header className="relative z-10 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-900/30">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-black" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <span className="text-sm font-black tracking-tight">
              100Shop <span className="text-yellow-400">Platform</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-100 transition">Features</a>
            <a href="#how" className="hover:text-zinc-100 transition">How It Works</a>
            <a href="#pricing" className="hover:text-zinc-100 transition">Pricing</a>
            <a href="#faq" className="hover:text-zinc-100 transition">FAQ</a>
          </nav>
          <a
            href="#signup"
            className="bg-yellow-500 hover:bg-yellow-400 active:scale-[0.98] text-black text-[13px] font-black px-5 py-2 rounded-xl transition shadow-lg shadow-yellow-900/30"
          >
            Start Free Trial
          </a>
        </div>
      </header>

      {/* ===== HERO：左文案 + 右注册表单 ===== */}
      <main className="relative z-10">
        <section className="max-w-6xl mx-auto px-5 pt-20 pb-16 grid lg:grid-cols-2 gap-14 items-center">
          {/* 左：卖点文案 */}
          <div>
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 mb-7">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">
                Multi-Tenant SaaS Platform
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05]">
              Launch Your Store in{' '}
              <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Minutes
              </span>
            </h1>
            <p className="text-zinc-400 mt-5 text-lg leading-relaxed max-w-md">
              No coding. No designers. No hassle. Get a fully automated online store with
              3 pre-loaded products — and start selling worldwide with PayPal today.
            </p>

            {/* 信任点 */}
            <ul className="mt-8 space-y-3.5">
              {[
                ['🛒', '3 best-selling products pre-loaded', 'Your storefront is live before you finish your coffee.'],
                ['💳', 'PayPal checkout included', 'Collect payments in USD from customers around the world.'],
                ['🔗', 'Your own store subdomain', 'A branded store URL is generated instantly on signup.'],
                ['⚡', 'Zero technical skills required', 'Everything is automated end to end.'],
              ].map(([icon, title, sub]) => (
                <li key={title} className="flex items-start gap-3.5">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-base">
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-100">{title}</p>
                    <p className="text-[12.5px] text-zinc-500 mt-0.5">{sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 右：注册表单卡片 */}
          <div id="signup" className="scroll-mt-20">
            <div className="relative">
              {/* 光晕 */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-yellow-500/25 via-zinc-800/10 to-purple-500/20 blur-2xl" />
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black tracking-tight">Start Your Free Trial</h2>
                    <p className="text-zinc-500 text-sm mt-1">
                      Get a store with 3 pre-loaded products instantly.
                    </p>
                  </div>
                  <span className="bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                    Free
                  </span>
                </div>

                {/* 注册结果 */}
                {result && (
                  <div
                    className={`mb-5 p-4 rounded-xl text-sm ${
                      result.success
                        ? 'bg-emerald-950/40 border border-emerald-700/70 text-emerald-300'
                        : 'bg-red-950/40 border border-red-800/70 text-red-300'
                    }`}
                  >
                    {result.success ? (
                      <>
                        <p className="font-bold flex items-center gap-2">
                          <span>🎉</span> {result.message}
                        </p>
                        <p className="mt-2 break-all font-mono text-[13px] bg-black/30 rounded-lg p-2.5 border border-emerald-800/40">
                          {result.storeUrl}
                        </p>
                        <p className="mt-2 text-xs opacity-80">
                          Save this URL — it is your storefront address.
                        </p>
                        <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                          <a
                            href={`/admin?tenantId=${result.tenantId}`}
                            className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black text-[13px] font-black text-center px-4 py-3 rounded-xl transition active:scale-[0.99]"
                          >
                            Open Admin Dashboard →
                          </a>
                          <a
                            href={result.storeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-100 text-[13px] font-black text-center px-4 py-3 rounded-xl transition active:scale-[0.99]"
                          >
                            Open My Store ↗
                          </a>
                        </div>
                      </>
                    ) : (
                      <p>{result.message}</p>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Store Name
                    </label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="My Awesome Store"
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none transition placeholder:text-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none transition placeholder:text-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-yellow-500 rounded-xl px-4 py-3.5 text-sm focus:outline-none transition placeholder:text-zinc-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black font-black px-8 py-4 rounded-xl transition active:scale-[0.99] shadow-xl shadow-yellow-900/30"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Creating your store...
                      </span>
                    ) : (
                      'Launch My Store →'
                    )}
                  </button>
                </form>

                <p className="text-zinc-600 text-xs mt-5 text-center">
                  Free trial · No credit card required · Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 功能亮点条 ===== */}
        <section className="border-y border-zinc-800/60 bg-zinc-900/40 backdrop-blur">
          <div className="max-w-6xl mx-auto px-5 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              ['⚡', 'Instant Setup', 'Store live in seconds'],
              ['🌍', 'Global Selling', 'Payments in USD via PayPal'],
              ['📦', 'Products Included', '3 pre-loaded bestsellers'],
              ['🔒', 'Secure Checkout', 'Server-side payment gateway'],
            ].map(([icon, title, sub]) => (
              <div key={title} className="flex flex-col items-center gap-1.5">
                <span className="text-2xl">{icon}</span>
                <p className="text-sm font-black text-zinc-100">{title}</p>
                <p className="text-[11.5px] text-zinc-500">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Features ===== */}
        <section id="features" className="max-w-6xl mx-auto px-5 py-20 scroll-mt-20">
          <div className="text-center mb-14">
            <span className="text-[11px] font-black uppercase tracking-widest text-yellow-400">Platform Features</span>
            <h2 className="text-4xl font-black tracking-tight mt-3">
              Everything you need to <span className="text-yellow-400">start selling</span>
            </h2>
            <p className="text-zinc-400 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              We handle the entire infrastructure — you focus on making sales.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🛍️',
                title: 'Ready-to-Sell Storefront',
                desc: 'A beautiful, conversion-optimized store with 3 best-selling products loaded and ready out of the box.',
              },
              {
                icon: '💸',
                title: 'PayPal Integrated Checkout',
                desc: 'Customers pay securely via PayPal in USD. Settlement flows straight into your merchant account.',
              },
              {
                icon: '🔑',
                title: 'Your Own Branded URL',
                desc: 'Get an instant store subdomain on signup — a professional storefront address you can share everywhere.',
              },
              {
                icon: '📈',
                title: 'Built to Scale',
                desc: 'Multi-tenant architecture with edge caching. Your store stays fast as your traffic grows.',
              },
              {
                icon: '🛡️',
                title: 'Secure by Design',
                desc: 'Server-side payment handling keeps credentials protected. Fraud controls built into the core.',
              },
              {
                icon: '🧩',
                title: 'Zero-Code Management',
                desc: 'Add products, manage orders and customize from a clean dashboard. No developer needed.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="group bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 hover:border-yellow-500/40 hover:bg-zinc-900 transition-all duration-300"
              >
                <div className="h-11 w-11 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xl mb-4 group-hover:border-yellow-500/40 transition">
                  {f.icon}
                </div>
                <h3 className="text-base font-black text-zinc-100">{f.title}</h3>
                <p className="text-[13px] text-zinc-400 leading-relaxed mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== How It Works ===== */}
        <section id="how" className="border-y border-zinc-800/60 bg-zinc-900/30 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-5 py-20">
            <div className="text-center mb-14">
              <span className="text-[11px] font-black uppercase tracking-widest text-yellow-400">How It Works</span>
              <h2 className="text-4xl font-black tracking-tight mt-3">
                Live in <span className="text-yellow-400">three</span> simple steps
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-10 relative">
              {/* 连接线（桌面端） */}
              <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-yellow-500/40 via-zinc-700 to-purple-500/40" />
              {[
                {
                  step: '01',
                  title: 'Create your store',
                  desc: 'Fill in your store name and email. Your store is created instantly — no waiting, no approval.',
                },
                {
                  step: '02',
                  title: 'Get your store URL',
                  desc: 'We generate a branded storefront subdomain with 3 products pre-loaded, ready to accept orders.',
                },
                {
                  step: '03',
                  title: 'Start getting paid',
                  desc: 'Share your link anywhere. Customers check out via PayPal and you collect USD sales.',
                },
              ].map((s) => (
                <div key={s.step} className="relative text-center md:text-left">
                  <div className="h-16 w-16 mx-auto md:mx-0 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-lg font-black text-yellow-400 shadow-lg shadow-black/40 relative z-10">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-black mt-5">{s.title}</h3>
                  <p className="text-[13px] text-zinc-400 leading-relaxed mt-2">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Pricing ===== */}
        <section id="pricing" className="max-w-6xl mx-auto px-5 py-20 scroll-mt-20">
          <div className="text-center mb-14">
            <span className="text-[11px] font-black uppercase tracking-widest text-yellow-400">Pricing</span>
            <h2 className="text-4xl font-black tracking-tight mt-3">
              Start free. Upgrade when you <span className="text-yellow-400">grow</span>
            </h2>
          </div>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-yellow-500/20 to-purple-500/20 blur-xl" />
              <div className="relative bg-zinc-900 border border-zinc-700 rounded-3xl p-8 text-center shadow-2xl shadow-black/50">
                <span className="bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Most Popular
                </span>
                <h3 className="text-xl font-black mt-4">Pro Merchant</h3>
                <div className="mt-4 flex items-baseline justify-center gap-1.5">
                  <span className="text-5xl font-black tracking-tight">$19.99</span>
                  <span className="text-zinc-400 text-sm">/month</span>
                </div>
                <p className="text-zinc-500 text-xs mt-1">after free trial · cancel anytime</p>
                <ul className="mt-7 space-y-3 text-left text-sm text-zinc-300">
                  {[
                    'Unlimited products',
                    'Custom domain support',
                    'PayPal payments enabled',
                    'Edge-cached fast storefront',
                    'Priority support',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span className="h-5 w-5 rounded-full bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 text-[10px]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="#signup"
                  className="mt-8 block bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black px-8 py-4 rounded-xl transition active:scale-[0.99] shadow-xl shadow-yellow-900/30"
                >
                  Start Free Trial
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="border-t border-zinc-800/60 bg-zinc-900/30 scroll-mt-20">
          <div className="max-w-3xl mx-auto px-5 py-20">
            <div className="text-center mb-14">
              <span className="text-[11px] font-black uppercase tracking-widest text-yellow-400">FAQ</span>
              <h2 className="text-4xl font-black tracking-tight mt-3">Questions? Answered.</h2>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: 'How much does it cost?',
                  a: 'Your first store is completely free to try. After the trial, the Pro Merchant plan is $19.99/month — cancel anytime, no questions asked.',
                },
                {
                  q: 'Do I need any coding skills?',
                  a: 'None at all. Your store, products and checkout are fully automated. If you can fill in a form, you can launch a store.',
                },
                {
                  q: 'How do I get paid by customers?',
                  a: 'Every checkout is powered by PayPal. Your customers pay in USD and the funds are settled to your connected merchant account.',
                },
                {
                  q: 'Can I use my own domain later?',
                  a: 'Yes. Pro merchants can connect a custom domain to their store, giving you a fully branded storefront.',
                },
                {
                  q: 'What happens after the free trial?',
                  a: 'You keep your store and your URL. To continue selling, simply subscribe to the Pro plan — your products and settings all stay intact.',
                },
              ].map((f) => (
                <details
                  key={f.q}
                  className="group bg-zinc-900/70 border border-zinc-800 rounded-2xl px-6 py-5 open:border-yellow-500/40 transition-colors"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="text-sm font-bold text-zinc-100">{f.q}</span>
                    <span className="text-zinc-500 group-open:rotate-45 transition-transform text-lg leading-none">＋</span>
                  </summary>
                  <p className="text-[13px] text-zinc-400 leading-relaxed mt-4">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 最终CTA ===== */}
        <section className="relative">
          <div className="max-w-4xl mx-auto px-5 py-24 text-center">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Ready to open your store?
            </h2>
            <p className="text-zinc-400 mt-4 text-lg">
              Join merchants selling worldwide. Your storefront is one click away.
            </p>
            <a
              href="#signup"
              className="mt-9 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black px-10 py-4 rounded-2xl transition active:scale-[0.99] shadow-2xl shadow-yellow-900/40"
            >
              Launch My Free Store →
            </a>
          </div>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="relative z-10 border-t border-zinc-800/60 bg-zinc-950/80">
        <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-black" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-6 9 6v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                <path d="M9 21V12h6v9" />
              </svg>
            </div>
            <span className="text-[13px] font-black">100Shop <span className="text-yellow-400">Platform</span></span>
          </div>
          <p className="text-[11px] text-zinc-600">
            © {new Date().getFullYear()} 100Shop Platform · Built for global merchants
          </p>
          <div className="flex gap-5 text-[11px] text-zinc-500">
            <a href="#features" className="hover:text-zinc-200 transition">Features</a>
            <a href="#pricing" className="hover:text-zinc-200 transition">Pricing</a>
            <a href="#faq" className="hover:text-zinc-200 transition">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
