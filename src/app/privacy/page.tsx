import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Privacy Policy",
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
  description: `Privacy Policy for ${siteConfig.name}. We don't collect or store the files you process. Detailed disclosure of analytics, cookies, and third-party services.`,
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated: May 25, 2026</p>

      <div className="mt-8 space-y-6 text-slate-700 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">The short version</h2>
          <p>
            {siteConfig.name} is designed with privacy as a core architectural principle, not a marketing afterthought. Every tool on this site processes your files entirely in your browser. Your files are never uploaded to our servers because there is no server-side file processing in our infrastructure. We cannot see, access, store, or share files you use with our tools &mdash; the code that handles them runs on your device, not ours.
          </p>
          <p className="mt-3">
            Beyond your files, we collect minimal data: aggregated analytics about how the site is used (anonymous), and standard server logs that are automatically discarded. We don&apos;t sell data. We don&apos;t build user profiles. We don&apos;t share information with data brokers. This policy describes exactly what we do and don&apos;t collect, why, and what choices you have.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Information we do not collect</h2>
          <p>
            We do not collect, store, or transmit any of the files you use with our tools. When you compress an image, merge a PDF, generate a QR code, convert audio, or use any other tool on this site, the entire processing pipeline happens locally in your browser using JavaScript and WebAssembly. No upload step exists. No file data ever reaches our servers. You can verify this yourself by opening your browser&apos;s developer tools, switching to the Network tab, and running any tool &mdash; you&apos;ll see no upload requests for your file.
          </p>
          <p className="mt-3">
            We also do not collect:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside pl-2">
            <li>Your name, email, address, or phone number (we don&apos;t require any registration)</li>
            <li>Payment information (the site is free; we have no payment system)</li>
            <li>Account credentials (there are no accounts)</li>
            <li>The content of files you process (technically impossible &mdash; see above)</li>
            <li>Search history within the site beyond what your browser stores locally</li>
            <li>Biometric data, government IDs, or any sensitive personal information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Information we may collect</h2>
          <p>
            We use <strong className="text-slate-900">Google Analytics</strong> to understand aggregate site usage. This collects anonymous data including: pages visited and time spent on each page, browser type and version, device type (mobile, tablet, desktop), operating system, approximate location (country level &mdash; never street-level), referring website (which site you came from), and basic engagement metrics like scroll depth and bounce rate. This data is aggregated and cannot be used to identify individual users.
          </p>
          <p className="mt-3">
            We also keep standard server access logs (IP address, timestamp, requested URL, user-agent string) for security and abuse prevention purposes. These logs are automatically rotated and discarded within 30 days.
          </p>
          <p className="mt-3">
            If you contact us via the <a href="/contact" className="text-blue-600 hover:underline">contact page</a>, we retain the email correspondence you send so we can respond. We do not add contact emails to marketing lists, share them, or use them for anything beyond responding to your inquiry.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Cookies</h2>
          <p>
            We use a small number of essential cookies for the website to function and remember your preferences:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside pl-2">
            <li><strong>Theme preference</strong> &mdash; remembers if you&apos;ve chosen dark mode (where supported)</li>
            <li><strong>Recently-used tools</strong> &mdash; stores a list of tools you&apos;ve recently visited (locally only)</li>
            <li><strong>Google Analytics cookies</strong> &mdash; for the anonymous analytics described above</li>
          </ul>
          <p className="mt-3">
            If we display advertisements (currently we do not, but may in the future), our advertising partners may set additional cookies for ad targeting and measurement. We will update this policy with specifics when and if that happens.
          </p>
          <p className="mt-3">
            You can control cookies through your browser settings. Blocking essential cookies may affect how some features work; blocking analytics cookies has no impact on tool functionality.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Advertising and AdSense</h2>
          <p>
            {siteConfig.name} may display advertisements from Google AdSense or other approved ad networks. These ad networks operate independently and may use cookies and similar technologies to serve relevant ads and measure their effectiveness.
          </p>
          <p className="mt-3">
            Specifically regarding <strong className="text-slate-900">Google AdSense</strong>:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside pl-2">
            <li>Google, as a third-party vendor, uses cookies to serve ads on this site</li>
            <li>Google&apos;s use of the DoubleClick DART cookie enables it to serve ads based on your visits to this site and other sites on the internet</li>
            <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google&apos;s Ads Settings</a></li>
            <li>You may also opt out of third-party vendors&apos; use of cookies for personalized ads by visiting <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">aboutads.info</a></li>
          </ul>
          <p className="mt-3">
            Ads are never displayed on tool widgets themselves &mdash; only on surrounding content. The browser-based architecture of the tools means ad networks cannot see the files you process, even when ads are present on the page.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Third-party services</h2>
          <p>We use a small number of third-party services, each with their own privacy policies:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside pl-2">
            <li><strong>Google Analytics</strong> &mdash; anonymous usage analytics. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Privacy Policy</a></li>
            <li><strong>Vercel</strong> &mdash; web hosting infrastructure. Server logs (IP, timestamp, URL) processed for security and performance. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Vercel Privacy Policy</a></li>
            <li><strong>Google AdSense</strong> (if/when ads are enabled) &mdash; advertising. See the section above for details.</li>
          </ul>
          <p className="mt-3">
            We do not use Facebook Pixel, TikTok pixel, LinkedIn Insight tag, or any other social media tracking technology. We do not share data with data brokers or marketing partners.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Data security</h2>
          <p>
            Because your files never leave your device, file-level security is as strong as the security of your own browser and device. We use HTTPS encryption for all connections to our website, ensuring that the JavaScript code that powers our tools is delivered to your browser without tampering. We do not store user files on any server, which eliminates the risk of file-level data breaches on our end &mdash; there is no file storage to breach.
          </p>
          <p className="mt-3">
            For the limited data we do collect (analytics, server logs, contact emails), we follow industry-standard practices: encrypted at rest where applicable, access-limited, automatically expired after defined retention periods.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Your rights under GDPR and CCPA</h2>
          <p>If you&apos;re in the EU/UK (GDPR) or California (CCPA), you have specific rights regarding your data:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside pl-2">
            <li><strong>Right to access</strong> &mdash; request what data we have about you (note: for most users, we have essentially nothing besides anonymous analytics)</li>
            <li><strong>Right to delete</strong> &mdash; request deletion of any data we have</li>
            <li><strong>Right to opt out</strong> &mdash; opt out of analytics via your browser&apos;s Do Not Track setting, or by blocking analytics cookies</li>
            <li><strong>Right to data portability</strong> &mdash; request your data in a structured format</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email <strong>contact@toolsepulse.co</strong>. We respond within 30 days. We don&apos;t require verification beyond reasonable matching to your inquiry, since we don&apos;t hold identity-verifying data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Children&apos;s privacy</h2>
          <p>
            Our services are available to users of all ages. We do not knowingly collect personal information from anyone, including children under 13. Since we don&apos;t require registration or collect identifying information, the standard COPPA concerns about collecting data from minors don&apos;t practically apply to our site.
          </p>
          <p className="mt-3">
            If you&apos;re a parent or guardian and believe your child has somehow provided personal information to us, please contact us and we&apos;ll investigate and remove any such data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time, particularly as we add new tools, integrate new third-party services, or as regulations evolve. Any changes will be reflected on this page with an updated revision date at the top. Material changes (new third-party services, changes to data collection) will be highlighted.
          </p>
          <p className="mt-3">
            For your convenience, we maintain this policy in plain language rather than legalese. If anything is unclear, please contact us &mdash; clarity matters more than legal padding.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Contact us</h2>
          <p>
            If you have any questions about this Privacy Policy, our data practices, or want to exercise your data rights:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside pl-2">
            <li>Email: <strong>contact@toolsepulse.co</strong></li>
            <li>Use the <a href="/contact" className="text-blue-600 hover:underline">contact page</a> for general inquiries</li>
            <li>For security-specific issues, see our <a href="/security" className="text-blue-600 hover:underline">security policy</a></li>
          </ul>
          <p className="mt-3">
            ToolsePulse is operated by Mohamed, a solo developer based in Freetown, Sierra Leone. All correspondence about privacy reaches the operator directly.
          </p>
        </section>
      </div>
    </div>
  );
}
