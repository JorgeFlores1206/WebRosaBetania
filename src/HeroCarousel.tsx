import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import "./carousel.css";

const slides = [
  {
    src: "/images/carousel-print.webp",
    alt: "Persona revisando una impresión fotográfica junto a una pantalla",
    label: "DEL DISEÑO A LO TANGIBLE",
    caption: "La idea se ve, se toca y se comparte.",
  },
  {
    src: "/images/carousel-press.webp",
    alt: "Prensa Heidelberg Speedmaster en detalle",
    label: "PRECISIÓN EN CADA TIRAJE",
    caption: "Tecnología que acompaña cada impresión.",
  },
  {
    src: "/images/empaques.webp",
    alt: "Bolsas, envoltorios y etiquetas con un diseño de marca coordinado",
    label: "TU MARCA EN CADA DETALLE",
    caption: "Empaques y etiquetas con personalidad.",
  },
] as const;

export default function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [loadMessage, setLoadMessage] = useState("");
  const images = useRef<Array<HTMLImageElement | null>>([]);
  const requestedSlide = useRef(0);
  const requestVersion = useRef(0);
  const gesture = useRef<{ x: number; y: number; id: number } | null>(null);
  const slide = slides[activeSlide];

  useEffect(
    () => () => {
      requestVersion.current += 1;
    },
    [],
  );

  async function goTo(index: number) {
    const next = (index + slides.length) % slides.length;
    requestedSlide.current = next;
    const version = ++requestVersion.current;
    const image = images.current[next];
    setLoadMessage("");

    // Keep the current photograph visible until the requested one is decoded.
    // The version also prevents a slow request from undoing more recent clicks.
    try {
      if (!image) return;
      await image.decode();
    } catch {
      if (!image?.complete || !image.naturalWidth) {
        if (version === requestVersion.current) {
          requestedSlide.current = activeSlide;
          setLoadMessage("Esta imagen no se pudo cargar. Prueba otra imagen.");
        }
        return;
      }
    }

    if (version === requestVersion.current) setActiveSlide(next);
  }

  function startGesture(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" || !event.isPrimary) return;
    if ((event.target as Element).closest("button")) return;
    gesture.current = {
      x: event.clientX,
      y: event.clientY,
      id: event.pointerId,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function endGesture(event: PointerEvent<HTMLDivElement>) {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const distanceX = event.clientX - start.x;
    const distanceY = event.clientY - start.y;
    if (
      Math.abs(distanceX) >= 44 &&
      Math.abs(distanceX) > Math.abs(distanceY) * 1.3
    ) {
      void goTo(requestedSlide.current + (distanceX < 0 ? 1 : -1));
    }
  }

  return (
    <section
      className="hero-visual hero-carousel"
      aria-roledescription="carrusel"
      aria-label="Galería de impresión y procesos"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        void goTo(
          requestedSlide.current + (event.key === "ArrowRight" ? 1 : -1),
        );
      }}
    >
      <div
        className="hero-carousel-stage"
        onPointerDown={startGesture}
        onPointerUp={endGesture}
        onPointerCancel={() => {
          gesture.current = null;
        }}
      >
        {slides.map((item, index) => (
          <img
            key={item.src}
            ref={(element) => {
              images.current[index] = element;
            }}
            className={`hero-carousel-image${index === activeSlide ? " is-active" : ""}${index === 2 ? " carousel-product-image" : ""}`}
            src={item.src}
            width="1200"
            height="750"
            alt={index === activeSlide ? item.alt : ""}
            aria-hidden={index !== activeSlide}
            fetchPriority={index === 0 ? "high" : "low"}
            loading="eager"
            decoding="async"
            draggable={false}
          />
        ))}
        <div className="hero-image-label" aria-hidden="true">
          <span key={slide.label}>{slide.label}</span>
          <ArrowUpRight size={22} />
        </div>
        <div
          className="hero-carousel-controls"
          role="group"
          aria-label="Controles del carrusel"
        >
          <span className="carousel-count" aria-hidden="true">
            <span>{String(activeSlide + 1).padStart(2, "0")}</span>
            <span className="carousel-count-divider" />
            <span>{String(slides.length).padStart(2, "0")}</span>
          </span>
          <div
            className="carousel-pagination"
            role="group"
            aria-label="Elegir imagen"
          >
            {slides.map((item, index) => (
              <button
                type="button"
                key={item.src}
                className={index === activeSlide ? "is-active" : ""}
                aria-label={`Ver imagen ${index + 1} de ${slides.length}`}
                aria-current={index === activeSlide ? "true" : undefined}
                onClick={() => {
                  void goTo(index);
                }}
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="carousel-arrows">
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => {
                void goTo(requestedSlide.current - 1);
              }}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => {
                void goTo(requestedSlide.current + 1);
              }}
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div className="hero-caption">
        <span className="color-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span
          className="carousel-caption-text"
          aria-live="polite"
          aria-atomic="true"
        >
          <span key={slide.caption}>{loadMessage || slide.caption}</span>
          <span className="carousel-sr-only">
            {" "}
            Imagen {activeSlide + 1} de {slides.length}.
          </span>
        </span>
      </div>
    </section>
  );
}
