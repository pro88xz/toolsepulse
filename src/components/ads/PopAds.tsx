"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

// Routes where popunders should NOT fire.
// Keeps legal/policy/contact pages clean for trust + future AdSense reapplication.
const EXCLUDED_PREFIXES = [
  "/privacy",
  "/terms",
  "/contact",
  "/about",
  "/security",
  "/.well-known",
];

export default function PopAds() {
  const pathname = usePathname();

  // Production-only — never fire in dev or preview deployments.
  if (process.env.NODE_ENV !== "production") return null;

  // Only fire on the live domain, not Vercel preview URLs.
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host !== "toolsepulse.co" && host !== "www.toolsepulse.co") return null;
  }

  // Skip excluded routes.
  if (EXCLUDED_PREFIXES.some((p) => pathname?.startsWith(p))) return null;

  return (
    <Script
      id="popads-loader"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
(function(){var r=window,b="b3d4a2f0a92ba997cb13fbe21a7b2c1b",l=[["siteId",264+209-32+578*966+4727951],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],w=["d3d3LnhhZHNtYXJ0LmNvbS9sVnBYL2xBd3V4L2Rib290c3RyYXAtbWFya2Rvd24ubWluLmpz","ZDExZW5xMnJ5bXkweWwuY2xvdWRmcm9udC5uZXQvaWpxdWVyeS5mb3JtLm1pbi5qcw=="],c=-1,q,p,a=function(){clearTimeout(p);c++;if(w[c]&&!(1805729203000<(new Date).getTime()&&1<c)){q=r.document.createElement("script");q.type="text/javascript";q.async=!0;var o=r.document.getElementsByTagName("script")[0];q.src="https://"+atob(w[c]);q.crossOrigin="anonymous";q.onerror=a;q.onload=function(){clearTimeout(p);r[b.slice(0,16)+b.slice(0,16)]||a()};p=setTimeout(a,5E3);o.parentNode.insertBefore(q,o)}};if(!r[b]){try{Object.freeze(r[b]=l)}catch(e){}a()}})();
        `,
      }}
    />
  );
}
