export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h1 className="text-5xl font-black tracking-tight">
          Launch Your Store in Minutes
        </h1>
        <p className="text-zinc-400 mt-4 text-lg">
          Free trial. No coding. Sell worldwide with PayPal.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl">
            Start Free Trial
          </button>
          <button className="border border-zinc-700 hover:border-zinc-500 px-8 py-3 rounded-xl">
            View Pricing
          </button>
        </div>
        <p className="text-zinc-600 text-sm mt-8">$19.99/month after free trial · Cancel anytime</p>
      </div>
    </div>
  );
}
