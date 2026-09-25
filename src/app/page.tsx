import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5 mb-6">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Multi-Tenant SaaS Platform</span>
        </div>
        <h1 className="text-5xl font-black tracking-tight">
          Launch Your Store in <span className="text-yellow-400">Minutes</span>
        </h1>
        <p className="text-zinc-400 mt-4 text-lg">
          Free trial. No coding. Sell worldwide with PayPal.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/platform"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl transition"
          >
            Start Free Trial
          </Link>
          <Link
            href="/platform"
            className="border border-zinc-700 hover:border-zinc-500 px-8 py-3 rounded-xl transition"
          >
            View Pricing
          </Link>
        </div>
        <p className="text-zinc-600 text-sm mt-8">$19.99/month after free trial · Cancel anytime</p>
      </div>
    </main>
  );
}
