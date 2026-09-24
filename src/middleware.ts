import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // 主商城绝对纯净，直接放行
  if (hostname === 'www.get100shop.com' || hostname === 'get100shop.com') {
    return NextResponse.next();
  }

  // 官方招商会员中心
  if (hostname === 'platform.cc.get100shop.com' || hostname === 'cc.get100shop.com') {
    return NextResponse.rewrite(new URL('/platform' + url.pathname, request.url));
  }

  // 三大免费工具子网
  if (hostname === 'ai.cc.get100shop.com') {
    return NextResponse.rewrite(new URL('/tools/ai' + url.pathname, request.url));
  }
  if (hostname === 'solar.cc.get100shop.com') {
    return NextResponse.rewrite(new URL('/tools/solar' + url.pathname, request.url));
  }
  if (hostname === 'starlink.cc.get100shop.com') {
    return NextResponse.rewrite(new URL('/tools/starlink' + url.pathname, request.url));
  }

  // 商家独立商城子域名
  const subdomainMatch = hostname.match(/^([a-z0-9-]+)\.cc\.get100shop\.com$/i);
  if (subdomainMatch) {
    const tenantId = subdomainMatch[1];
    return NextResponse.rewrite(
      new URL(`/shop/_tenant/${tenantId}${url.pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
