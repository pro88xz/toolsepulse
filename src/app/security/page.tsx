import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security Policy | ToolsePulse",
  description: "ToolsePulse's vulnerability disclosure policy. How to report security issues responsibly.",
  alternates: { canonical: "https://toolsepulse.co/security" },
  robots: { index: true, follow: true },
};

export default function SecurityPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Security Policy
      </h1>
      <p className="mt-4 text-slate-600">
        Last updated: May 25, 2026
      </p>

      <section className="mt-8 space-y-4 text-slate-700 leading-relaxed">
        <p>
          ToolsePulse takes security seriously. Every tool on this site runs entirely in your browser — your files never upload to our servers. That makes most server-side vulnerabilities impossible. Still, we welcome responsible disclosure of any security issues you discover.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-10">How to report a vulnerability</h2>
        <p>
          Send a detailed report to <a href="mailto:security@toolsepulse.co" className="text-blue-600 hover:underline font-medium">security@toolsepulse.co</a>. Please include:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>A clear description of the issue</li>
          <li>Steps to reproduce</li>
          <li>The potential impact</li>
          <li>Your name or handle if you&apos;d like credit</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-10">What you can expect from us</h2>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>An acknowledgment within 72 hours of your report</li>
          <li>Honest communication about the issue and our timeline to fix it</li>
          <li>Public credit (if you want it) once the fix is deployed</li>
          <li>No legal action for good-faith research that follows this policy</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-10">Scope</h2>
        <p>This policy covers vulnerabilities in:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>The toolsepulse.co website and its subdomains</li>
          <li>The browser-based tools served from this site</li>
          <li>Any official API endpoints (currently very limited)</li>
        </ul>
        <p className="mt-4">Out of scope:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Issues in third-party browser extensions that integrate with our tools</li>
          <li>Social engineering attacks against ToolsePulse staff</li>
          <li>Physical attacks against any infrastructure</li>
          <li>Denial-of-service via traffic flooding</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-10">Responsible disclosure</h2>
        <p>
          Please give us a reasonable window — typically 90 days — to address an issue before any public disclosure. We will work in good faith to fix issues promptly. If a fix takes longer than 90 days for legitimate reasons, we&apos;ll communicate timelines openly.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-10">Privacy by design</h2>
        <p>
          ToolsePulse is built privacy-first. We don&apos;t upload your files. We don&apos;t track individual users for advertising purposes. We use standard analytics for aggregate traffic understanding only. For details, see our <Link href="/privacy" className="text-blue-600 hover:underline font-medium">Privacy Policy</Link>.
        </p>
      </section>

      <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        <p>
          Looking for our <code className="rounded bg-white px-1.5 py-0.5 border border-slate-200 text-xs">security.txt</code> file? It&apos;s at <a href="/.well-known/security.txt" className="text-blue-600 hover:underline">/.well-known/security.txt</a> as defined by{" "}
          <a href="https://www.rfc-editor.org/rfc/rfc9116" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">RFC 9116</a>.
        </p>
      </div>
    </article>
  );
}
