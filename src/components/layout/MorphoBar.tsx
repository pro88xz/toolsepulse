import { ArrowRight, DeviceMobile } from "@phosphor-icons/react/dist/ssr";

/** Site-wide promo strip above the header. Server component, no JS. */
export default function MorphoBar() {
  return (
    <div className="tp-promo">
      <a className="tp-promo-link" href="https://play.google.com/store/apps/details?id=cc.devbangs.morpho" target="_blank" rel="noopener">
        <DeviceMobile size={17} weight="bold" />
        <span className="tp-promo-strong">Morpho for Android</span>
        <span className="tp-promo-text">133 file tools on your phone, 118 of them offline</span>
        <span className="tp-promo-cta">
          Get it on Google Play
          <ArrowRight size={12} weight="bold" />
        </span>
      </a>
    </div>
  );
}
