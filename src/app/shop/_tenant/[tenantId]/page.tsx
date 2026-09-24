export default function TenantShopPage({ params }: { params: { tenantId: string } }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-black">Welcome to the Store</h1>
        <p className="text-zinc-400 mt-2">Tenant: {params.tenantId}</p>
      </div>
    </div>
  );
}
