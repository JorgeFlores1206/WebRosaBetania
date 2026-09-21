import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { company, navigation } from "./data";

export function Button({
  to,
  children,
  variant = "primary",
  arrow = true,
}: {
  to: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  arrow?: boolean;
}) {
  return (
    <Link className={`button button-${variant}`} to={to}>
      {children}
      {arrow && <ArrowUpRight size={17} aria-hidden="true" />}
    </Link>
  );
}
export function TextLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link className="text-link" to={to}>
      {children}
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <img
      className="logo"
      src={`/images/logo-${light ? "light" : "green"}.png`}
      width="350"
      height="215"
      alt="Rosa Betania · Industria Gráfica"
    />
  );
}
export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 801px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <div className="utility-bar">
        <div className="container utility-inner">
          <span>
            <MapPin size={12} aria-hidden="true" />
            Santa Cruz de la Sierra, Bolivia
          </span>
          <a href={company.phoneHref}>
            <Phone size={12} aria-hidden="true" />
            {company.phone}
          </a>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link
            to="/"
            className="brand"
            aria-label="Rosa Betania, ir al inicio"
          >
            <Logo />
          </Link>
          <nav aria-label="Navegación principal" className="desktop-nav">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} end>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-cta">
            <Button to="/cotizacion">Solicitar cotización</Button>
          </div>
          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            aria-controls="mobile-navigation"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        <nav
          id="mobile-navigation"
          aria-label="Navegación móvil"
          className="mobile-nav"
          hidden={!open}
        >
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={() => setOpen(false)}
            >
              {item.label}
              <ArrowUpRight size={17} aria-hidden="true" />
            </NavLink>
          ))}
        </nav>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" aria-label="Rosa Betania, inicio">
            <Logo light />
          </Link>
          <p>
            El cuidado que tus ideas merecen.
            <br />
            Impresión offset y digital en Santa Cruz.
          </p>
          <span className="footer-place">HECHO PARA DEJAR IMPRESIÓN.</span>
        </div>
        <div>
          <h2>Explora</h2>
          <nav aria-label="Navegación del pie">
            {navigation.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>
          <a
            className="footer-map"
            href={company.facebook}
            target="_blank"
            rel="noreferrer"
          >
            Facebook
            <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only"> (abre en otra pestaña)</span>
          </a>
        </div>
        <div>
          <h2>Encuéntranos</h2>
          <p>
            {company.address}
            <br />
            Entre Tarija y Cobija
            <br />
            Santa Cruz, Bolivia
          </p>
          <a className="footer-phone" href={company.phoneHref}>
            <Phone size={15} aria-hidden="true" />
            {company.phone}
          </a>
          <a
            className="footer-map"
            href={company.maps}
            target="_blank"
            rel="noreferrer"
          >
            Ver ubicación
            <ArrowUpRight size={15} aria-hidden="true" />
            <span className="sr-only"> (abre en otra pestaña)</span>
          </a>
        </div>
        <div>
          <h2>Horario de atención</h2>
          <p>
            Lunes a viernes
            <br />
            <span>{company.weekdays}</span>
          </p>
          <p>
            Sábados
            <br />
            <span>{company.saturday}</span>
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} Industria Gráfica Rosa Betania.
        </span>
        <span>Ideas que toman forma.</span>
      </div>
    </footer>
  );
}
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="page-intro container">
      <p className="eyebrow">
        <span />
        {eyebrow}
      </p>
      <h1>{title}</h1>
      <p className="intro-description">{children}</p>
    </section>
  );
}
export function QuoteBanner() {
  return (
    <section className="quote-banner container">
      <div>
        <p className="eyebrow">DE LA IDEA AL PAPEL</p>
        <h2>
          Tu próximo proyecto
          <br />
          empieza aquí.
        </h2>
      </div>
      <div>
        <p>
          Cuéntanos qué tienes en mente.
          <br />
          Demos el siguiente paso juntos.
        </p>
        <Button to="/cotizacion" variant="light">
          Solicitar cotización
        </Button>
      </div>
      <span className="banner-rings" aria-hidden="true" />
    </section>
  );
}
export function ContactHours() {
  return (
    <div className="contact-hours">
      <Clock3 size={23} aria-hidden="true" />
      <div>
        <h3>Te esperamos</h3>
        <p>
          Lunes a viernes
          <br />
          <strong>{company.weekdays}</strong>
        </p>
        <p>
          Sábados
          <br />
          <strong>{company.saturday}</strong>
        </p>
      </div>
    </div>
  );
}
