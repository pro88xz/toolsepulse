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
(function(){var q=window,k="d377e9c006ae1c2b2325786b2c5e47f2",s=[["siteId",175-832-305+5303256],["minBid",0],["popundersPerIP","0"],["delayBetween",0],["default",false],["defaultPerDay",0],["topmostLayer","auto"]],a=["d3d3LnhhZHNtYXJ0LmNvbS91S2ovd2pxdWVyeS50YWJsZXNvcnRlci5taW4uanM=","ZDExZW5xMnJ5bXkweWwuY2xvdWRmcm9udC5uZXQvZ2VjcW0vV0MvanJlYWN0LnByb2R1Y3Rpb24ubWluLmNzcw=="],p=-1,d,n,i=function(){clearTimeout(n);p++;if(a[p]&&!(1805730921000<(new Date).getTime()&&1<p)){d=q.document.createElement("script");d.type="text/javascript";d.async=!0;var o=q.document.getElementsByTagName("script")[0];d.src="https://"+atob(a[p]);d.crossOrigin="anonymous";d.onerror=i;d.onload=function(){clearTimeout(n);q[k.slice(0,16)+k.slice(0,16)]||i()};n=setTimeout(i,5E3);o.parentNode.insertBefore(d,o)}};if(!q[k]){try{Object.freeze(q[k]=s)}catch(e){}i()}})();
        `,
      }}
    />
  );
}
