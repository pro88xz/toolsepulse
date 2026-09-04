/**
 * Inline SVG mockups. Server components — no interactivity, no runtime cost.
 * Colours are literal rather than tokenised because both scenes always sit on
 * the same tinted panel background.
 */

/** Hero: a tool mid-job, showing the compression result and a zero-byte note. */
export function ToolRunScene() {
  return (
    <svg
      viewBox="0 0 420 250"
      className="tp-scene"
      role="img"
      aria-label="The PDF compressor reducing a 40 MB file to 8 MB entirely on the device"
    >
      <rect x="10" y="12" width="400" height="226" rx="13" fill="#fff" stroke="#DCE3EC" />
      <path d="M10 25a13 13 0 0 1 13-13h374a13 13 0 0 1 13 13v17H10z" fill="#F1F4F9" />
      <circle cx="30" cy="27" r="4.2" fill="#E2E8F0" />
      <circle cx="45" cy="27" r="4.2" fill="#E2E8F0" />
      <circle cx="60" cy="27" r="4.2" fill="#E2E8F0" />
      <rect x="80" y="19" width="230" height="16" rx="8" fill="#fff" stroke="#E2E8F0" />
      <text x="92" y="31" fontSize="9.5" fill="#94A3B8">
        toolsepulse.co/tools/pdf-compressor
      </text>

      <rect x="28" y="62" width="364" height="62" rx="12" fill="#FBFCFE" stroke="#E6ECF4" />
      <rect x="44" y="76" width="34" height="34" rx="7" fill="#F0554B" />
      <path d="M53 87h10M53 93h10M53 99h6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      <text x="90" y="88" fontSize="12.5" fontWeight="700" fill="#0E1726">
        quarterly-report.pdf
      </text>
      <text x="90" y="106" fontSize="11" fill="#8A97A8">
        40.2 MB
      </text>
      <path d="M150 102h16" stroke="#C3CDDB" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M163 99l4 3-4 3" stroke="#C3CDDB" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <text x="174" y="106" fontSize="11" fontWeight="700" fill="#047857">
        8.1 MB
      </text>
      <circle cx="366" cy="93" r="12" fill="#12B981" />
      <path
        d="M360 93l4.4 4.4L373 89"
        stroke="#fff"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <rect x="28" y="140" width="364" height="7" rx="3.5" fill="#EDF1F6" />
      <rect x="28" y="140" width="364" height="7" rx="3.5" fill="#12B981" />

      <rect x="28" y="166" width="128" height="34" rx="9" fill="url(#tpGrad)" />
      <text x="92" y="188" fontSize="12.5" fontWeight="700" fill="#fff" textAnchor="middle">
        Download
      </text>
      <text x="172" y="188" fontSize="11" fill="#8A97A8">
        0 bytes uploaded · done on this device
      </text>

      <defs>
        <linearGradient id="tpGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1D4ED8" />
          <stop offset="52%" stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#DB2777" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Proof block: the browser network panel, recording, with nothing in it. */
export function NetworkScene() {
  return (
    <svg
      viewBox="0 0 420 250"
      className="tp-scene"
      role="img"
      aria-label="A browser network panel recording zero requests while a PDF is compressed"
    >
      <rect x="10" y="12" width="400" height="226" rx="13" fill="#fff" stroke="#DCE3EC" />
      <path d="M10 25a13 13 0 0 1 13-13h374a13 13 0 0 1 13 13v17H10z" fill="#F1F4F9" />
      <circle cx="30" cy="27" r="4.2" fill="#E2E8F0" />
      <circle cx="45" cy="27" r="4.2" fill="#E2E8F0" />
      <circle cx="60" cy="27" r="4.2" fill="#E2E8F0" />
      <text x="86" y="31" fontSize="10.5" fill="#9AA6B6">
        Elements
      </text>
      <text x="142" y="31" fontSize="10.5" fill="#9AA6B6">
        Console
      </text>
      <text x="196" y="31" fontSize="10.5" fontWeight="700" fill="#1D4ED8">
        Network
      </text>
      <rect x="193" y="36" width="52" height="2.6" rx="1.3" fill="#1D4ED8" />
      <circle cx="270" cy="27" r="5" fill="#EF4444" />
      <text x="282" y="31" fontSize="10" fill="#9AA6B6">
        recording
      </text>

      <line x1="10" y1="62" x2="410" y2="62" stroke="#EDF1F6" />
      <text x="28" y="56" fontSize="9.5" fill="#B7C0CE">
        Name
      </text>
      <text x="170" y="56" fontSize="9.5" fill="#B7C0CE">
        Status
      </text>
      <text x="248" y="56" fontSize="9.5" fill="#B7C0CE">
        Type
      </text>
      <text x="330" y="56" fontSize="9.5" fill="#B7C0CE">
        Size
      </text>

      <rect
        x="28"
        y="80"
        width="364"
        height="120"
        rx="11"
        fill="#FBFCFE"
        stroke="#E6ECF4"
        strokeDasharray="6 5"
      />
      <circle cx="210" cy="122" r="18" fill="none" stroke="#C9D3E0" strokeWidth="2.6" />
      <line
        x1="197.5"
        y1="109.5"
        x2="222.5"
        y2="134.5"
        stroke="#C9D3E0"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <text x="210" y="162" fontSize="14" fontWeight="700" fill="#5A6879" textAnchor="middle">
        0 requests · 0 B transferred
      </text>
      <text x="210" y="181" fontSize="11" fill="#9AA6B6" textAnchor="middle">
        recorded while compressing a 40 MB PDF
      </text>
      <rect x="28" y="212" width="130" height="14" rx="7" fill="#EEF2F7" />
    </svg>
  );
}
