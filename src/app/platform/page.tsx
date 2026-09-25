'use client';

import { useState } from 'react';

export default function PlatformPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; storeUrl?: string } | null>(null);

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-3xl mx-auto px-4 py-20">
        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-black tracking-tight">
            Launch Your Store in <span className="text-yellow-400">Minutes</span>
          </h1>
          <p className="text-zinc-400 mt-4 text-lg">
            Free trial. No coding. Sell worldwide with PayPal.
          </p>
        </div>

        {/* Register form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
          <h2 className="text-xl font-black mb-1">Start Your Free Trial</h2>
          <p className="text-zinc-500 text-sm mb-6">
            Get a store with 3 pre-loaded products instantly.
          </p>

          {result && (
            <div
              className={`mb-5 p-3 rounded-lg text-sm ${
                result.success
                  ? 'bg-emerald-950/40 border border-emerald-700 text-emerald-300'
                  : 'bg-red-950/40 border border-red-800 text-red-300'
              }`}
            >
              {result.success ? (
                <>
                  <p className="font-bold">{result.message}</p>
                  <p className="mt-1 break-all">Your store URL: {result.storeUrl}</p>
                  <p className="mt-1 text-xs opacity-80">Save this URL — it is your storefront address.</p>
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
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
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
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
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
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-black font-bold px-8 py-3 rounded-xl transition"
            >
              {loading ? 'Creating your store...' : 'Start Free Trial →'}
            </button>
          </form>

          <p className="text-zinc-600 text-xs mt-5 text-center">
            $19.99/month after free trial · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
