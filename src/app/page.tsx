import {
  ArrowsOutSimple,
  CaretDown,
  CloudSlash,
  DeviceMobile,
  Password,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import { tools, type ToolCategory } from "@/config/tools";
import { categoryOrder } from "@/config/categories";
import ToolBrowser from "@/components/home/ToolBrowser";
import ToolCard from "@/components/home/ToolCard";
import { NetworkScene, ToolRunScene } from "@/components/home/Scenes";

const TOTAL = tools.length;

const HERO_FACTS = [
  { Icon: ShieldCheck, label: "Files never leave your device" },
  { Icon: Password, label: "No account or email" },
  { Icon: ArrowsOutSimple, label: "No size limit" },
];

const PROOF_POINTS = [
  {
    Icon: CloudSlash,
    title: "Nothing is uploaded",
    body: "There is no server waiting to receive your file, so none is sent.",
  },
  {
    Icon: ArrowsOutSimple,
    title: "No file size cap",
    body: "Upload limits exist to save bandwidth. Nothing is uploaded here.",
  },
  {
    Icon: DeviceMobile,
    title: "Every tool works on a phone",
    body: "The same tools, not a cut-down mobile set.",
  },
  {
    Icon: Password,
    title: "No account, ever",
    body: "No email, no signup wall, no watermark on your output.",
  },
];

const FAQ = [
  {
    q: "Is it really free?",
    a: "Yes. Every tool, no limits, no premium tier, no watermark. Ads pay for the site.",
  },
  {
    q: "Where does my file actually go?",
    a: "Nowhere. The tool code downloads to your device and reads the file off your own disk.",
  },
  {
    q: "Do I need an account?",
    a: "No signup, no login, no email for any tool.",
  },
  {
    q: "Why is there no file size limit?",
    a: "Size limits control upload bandwidth. Nothing is uploaded, so there is nothing to limit.",
  },
  {
    q: "Does it work on a phone?",
    a: "Yes, all of it. Large video will be slower, since your phone does the processing.",
  },
];

export default function HomePage() {
  const counts = categoryOrder.reduce(
    (acc, key) => {
      acc[key] = tools.filter((t) => t.category === key).length;
      return acc;
    },
    {} as Record<ToolCategory, number>,
  );

  // Copy before sorting — `tools` is a shared module-level array and sorting
  // it in place would reorder it for every other page that imports it.
  const ranked = [...tools].sort(
    (a, b) =>
      categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) ||
      Number(b.isPopular) - Number(a.isPopular) ||
      a.name.localeCompare(b.name),
  );

  return (
    <div className="tp-bleed">
      <ToolBrowser
        total={TOTAL}
        counts={counts}
        heroArt={<ToolRunScene />}
        hero={
          <>
            <h1 className="tp-h1">Every file tool you need. Not one of them sees your file.</h1>
            <p className="tp-lede">
              {TOTAL} tools for PDFs, images, video, audio and text — all running inside this
              browser tab, on the device your file is already on.
            </p>
            <ul className="tp-facts">
              {HERO_FACTS.map(({ Icon, label }) => (
                <li key={label}>
                  <Icon size={17} weight="bold" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </>
        }
      >
        {ranked.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </ToolBrowser>

      <section className="tp-proof">
        <div>
          <h2 className="tp-h2">Built the opposite way round</h2>
          <p className="tp-proof-lede">
            Every other free converter takes your file to their servers. This one brings the tool
            to your file.
          </p>
          <ul>
            {PROOF_POINTS.map(({ Icon, title, body }) => (
              <li key={title}>
                <i>
                  <Icon size={19} weight="bold" />
                </i>
                <div>
                  <b>{title}</b>
                  <span>{body}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="tp-proof-art">
          <NetworkScene />
        </div>
      </section>

      <section className="tp-faqs">
        <h2 className="tp-h2">Common questions</h2>
        <div>
          {FAQ.map(({ q, a }) => (
            <details key={q} className="tp-faq">
              <summary>
                {q}
                <i className="tp-car">
                  <CaretDown size={16} weight="bold" />
                </i>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
