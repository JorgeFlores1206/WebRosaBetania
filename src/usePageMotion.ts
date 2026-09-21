import { useEffect, useRef } from "react";

// Content stays visible by default: animations enhance it only when supported.
const revealSelector = [
  ".section-heading",
  ".product-preview",
  ".printing-preview-inner > div",
  ".technology-preview > div",
  ".feature-equipment",
  ".equipment-secondary > article",
  ".color-proof-inner > div",
  ".quote-banner",
  ".catalog-card",
  ".advice-strip",
  ".printing-options > article",
  ".comparison-table-wrap",
  ".comparison-help",
  ".contact-layout > div",
  ".contact-project",
  ".quote-aside",
  ".quote-form fieldset",
].join(",");

export function usePageMotion(pathname: string, contentKey: string) {
  const revealed = useRef(new WeakSet<Element>());

  useEffect(() => {
    const root = document.getElementById("main");
    if (!root || !window.IntersectionObserver || !Element.prototype.animate)
      return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Map<Element, Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          observer.unobserve(element);
          if (revealed.current.has(element)) continue;
          revealed.current.add(element);
          element.dataset.motion = "revealed";
          if (preference.matches || element.contains(document.activeElement))
            continue;

          // Only stagger peers in the same row, not unrelated sections down the page.
          const peers = Array.from(element.parentElement?.children ?? []);
          const stagger = element.matches(
            ".product-preview, .catalog-card, .printing-options > article",
          )
            ? Math.min(peers.indexOf(element) % 4, 3) * 65
            : 0;
          const animation = element.animate(
            [
              { opacity: 0, transform: "translateY(20px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 620,
              delay: stagger,
              easing: "cubic-bezier(.2,.7,.25,1)",
              fill: "backwards",
            },
          );
          animations.set(element, animation);
          animation.finished
            .then(() => animations.delete(element))
            .catch(() => {});
        }
      },
      { threshold: 0.08 },
    );

    const watch = () => {
      observer.disconnect();
      if (preference.matches) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
        return;
      }
      root.querySelectorAll(revealSelector).forEach((element) => {
        if (!revealed.current.has(element)) observer.observe(element);
      });
    };
    // Keyboard navigation must never focus a temporarily transparent control.
    const onFocus = (event: FocusEvent) => {
      animations.forEach((animation, element) => {
        if (event.target instanceof Node && element.contains(event.target)) {
          animation.cancel();
          animations.delete(element);
        }
      });
    };
    watch();
    preference.addEventListener("change", watch);
    root.addEventListener("focusin", onFocus);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", watch);
      root.removeEventListener("focusin", onFocus);
    };
  }, [pathname, contentKey]);
}
