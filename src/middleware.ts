import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // 主商城绝对纯净，直接放行（含 vccshop.vercel.app 等 Vercel 预览域名）
  if (
    hostname === 'www.get100shop.com' ||
    hostname === 'get100shop.com' ||
    hostname.endsWith('.vercel.app')
  ) {
    return NextResponse.next();
  }

  // 官方招商会员中心
  if (hostname === 'platform.cc.get100shop.com' || hostname === 'cc.get100shop.com') {
    // 商户后台、店铺前台等真实路径直接放行，其余（含 /）重写到招商页
    if (
      url.pathname.startsWith('/admin') ||
      url.pathname.startsWith('/shop') ||
      url.pathname.startsWith('/tools') ||
      url.pathname.startsWith('/platform')
    ) {
      return NextResponse.next();
    }
    const target = '/platform' + url.pathname;
    return NextResponse.rewrite(new URL(target, request.url));
  }

  // 三大免费工具子网
  if (hostname === 'ai.cc.get100shop.com') {
    const target = url.pathname.startsWith('/tools/ai') ? url.pathname : '/tools/ai' + url.pathname;
    return NextResponse.rewrite(new URL(target, request.url));
  }
  if (hostname === 'solar.cc.get100shop.com') {
    const target = url.pathname.startsWith('/tools/solar') ? url.pathname : '/tools/solar' + url.pathname;
    return NextResponse.rewrite(new URL(target, request.url));
  }
  if (hostname === 'starlink.cc.get100shop.com') {
    const target = url.pathname.startsWith('/tools/starlink') ? url.pathname : '/tools/starlink' + url.pathname;
    return NextResponse.rewrite(new URL(target, request.url));
  }

  // 商家独立商城子域名（排除 www）
  if (!hostname.startsWith('www.')) {
    const subdomainMatch = hostname.match(/^([a-z0-9-]+)\.cc\.get100shop\.com$/i);
    if (subdomainMatch) {
      const tenantId = subdomainMatch[1];
      const prefix = `/shop/tenant/${tenantId}`;
      const target = url.pathname.startsWith(prefix) ? url.pathname : prefix + url.pathname;
      return NextResponse.rewrite(new URL(target, request.url));
    }
  }

  // 商家自定义绑定域名（如 merchant.com）→ 走 KV 查询标识
  if (hostname.includes('.') && !hostname.endsWith('.get100shop.com')) {
    const prefix = `/shop/tenant/custom:${hostname}`;
    const target = url.pathname.startsWith(prefix) ? url.pathname : prefix + url.pathname;
    return NextResponse.rewrite(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
