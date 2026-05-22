import Link from "next/link";
import { siteConfig } from "@/config/site";
import { categories, getPopularTools } from "@/config/tools";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const popularTools = getPopularTools().slice(0, 5);

  return (
    <footer className="relative bg-slate-900 text-slate-300">
      {/* Brand gradient accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: "linear-gradient(90deg, #1D4ED8 0%, #6D28D9 50%, #DB2777 100%)" }}
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img src="/logo.png" alt="ToolsePulse" className="h-9 w-auto object-contain" width={108} height={36} />
              <span className="text-lg font-bold tracking-tight">
                <span className="text-white">Toolse</span>
                <span
                  className="bg-clip-text text-transparent font-extrabold"
                  style={{ backgroundImage: "linear-gradient(90deg, #60A5FA 0%, #A78BFA 50%, #F472B6 100%)" }}
                >
                  Pulse
                </span>
              </span>
            </Link>

            <p className="mt-3 text-[10px] uppercase tracking-[0.25em] font-semibold text-slate-500">
              All Tools. One Pulse.
            </p>

            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Free online tools that respect your privacy. No uploads, no signups, no limits.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Categories</h3>
            <ul className="mt-4 space-y-2">
              {Object.entries(categories).map(([key, category]) => (
                <li key={key}>
                  <Link
                    href={`/category/${key}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Tools (dynamic) */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Popular Tools</h3>
            <ul className="mt-4 space-y-2">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/affiliate-disclosure" className="text-sm text-slate-400 hover:text-white transition-colors">Affiliate Disclosure</Link></li>
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All processing happens locally in your browser
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
