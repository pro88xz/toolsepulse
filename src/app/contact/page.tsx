"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const mailtoLink = `mailto:contact@toolsepulse.co?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  const inputClass = "w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Contact ToolsePulse</h1>
      <p className="mt-3 text-base text-slate-500">
        Questions, suggestions, bug reports, partnership inquiries &mdash; every message reaches me directly.
      </p>

      <div className="mt-10 space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Who you&apos;re reaching</h2>
          <p>
            I&apos;m <strong className="text-slate-900">Mohamed</strong>, the solo builder and operator of ToolsePulse. I read every email that comes through this page and respond to most within 24-48 hours. There is no support team, no automated ticketing system, no &ldquo;your inquiry is important to us&rdquo; auto-reply. Just one developer trying to make useful tools and improve them based on what users actually need.
          </p>
          <p className="mt-3">
            I&apos;m based in <strong className="text-slate-900">Freetown, Sierra Leone</strong> (GMT timezone). If you email outside my working hours, I&apos;ll typically respond the following morning local time. For urgent issues &mdash; security vulnerabilities, broken tools, abuse reports &mdash; flag &ldquo;URGENT&rdquo; in the subject line and I&apos;ll prioritize.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Direct contact methods</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">General</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">contact@toolsepulse.co</div>
              <p className="mt-1 text-xs text-slate-500">For tool requests, bug reports, feedback, partnership inquiries.</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Security</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">security@toolsepulse.co</div>
              <p className="mt-1 text-xs text-slate-500">For vulnerability disclosures. See the <Link href="/security" className="text-blue-600 hover:underline">security policy</Link> for details.</p>
            </div>
          </div>
          <p className="mt-4 text-sm">
            Both addresses go to the same inbox during normal operations, but the <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">security@</code> address signals priority for security-related reports.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">What to contact about</h2>
          <p>I genuinely want to hear about:</p>
          <ul className="mt-3 space-y-2 list-disc list-inside pl-2">
            <li><strong>Tool requests.</strong> Missing a tool you&apos;d use? Tell me what it should do, how often you&apos;d use it, and what existing tools (paid or free) currently fill the gap. Most tools on the site grew from these requests.</li>
            <li><strong>Bug reports.</strong> A tool not working as expected? Include the file type, what you tried to do, what happened instead, and your browser/device. The more specific, the faster I can reproduce and fix.</li>
            <li><strong>Suggestions for existing tools.</strong> Feature missing, UX confusing, output not quite right? Tell me. Small UX improvements often have outsized impact.</li>
            <li><strong>Partnership and business inquiries.</strong> Press, advertising (rare &mdash; see <Link href="/affiliate-disclosure" className="text-blue-600 hover:underline">affiliate disclosure</Link>), licensing, or collaboration.</li>
            <li><strong>Privacy and data concerns.</strong> Worried about how a specific tool handles your file? Want clarification on a privacy policy point? Ask directly.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Response time</h2>
          <p>
            Most emails get a personal response within <strong className="text-slate-900">24-48 hours</strong>. Bug reports with clear reproduction steps often get acknowledged within a few hours. Tool feature requests get a thoughtful response, even if the answer is &ldquo;not soon &mdash; here&apos;s why.&rdquo; The only emails I don&apos;t respond to are clearly automated marketing or SEO outreach spam.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Before you send</h2>
          <p>
            If your question is about how a specific tool works, scroll to the bottom of that tool&apos;s page first &mdash; most have FAQ sections that may answer your question instantly. If you&apos;re experiencing a tool not loading or showing a blank page, try in a different browser or in incognito mode first; that fixes about half of reported issues.
          </p>
          <p className="mt-3">
            For everything else, the form below opens your email client pre-filled with your message. If your device doesn&apos;t have a default email client configured, just copy the email address above and write from your usual mail app.
          </p>
        </section>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Send a message</h2>
        {submitted ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
            <div className="inline-flex rounded-full bg-green-100 p-4 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-900">Thanks for reaching out!</h3>
            <p className="text-sm text-green-700 mt-2">Your email client should have opened with the message. If it didn&apos;t, email <strong>contact@toolsepulse.co</strong> directly.</p>
            <button onClick={() => setSubmitted(false)} className="btn-secondary mt-6 py-2.5 px-6">
              Send another message
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message, feedback, bug report, or tool suggestion..." rows={6} className={inputClass + " resize-none"} />
              </div>
              <button onClick={handleSubmit} disabled={!name || !email || !message} className="btn-primary w-full py-3">
                Send message
              </button>
              <p className="text-xs text-slate-500 text-center">
                This opens your email client. Nothing is sent until you click &ldquo;Send&rdquo; in your mail app.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
