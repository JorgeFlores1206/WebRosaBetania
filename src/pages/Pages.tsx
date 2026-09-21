import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Layers3,
  MapPin,
  Phone,
  ScanLine,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Button,
  ContactHours,
  PageIntro,
  QuoteBanner,
  TextLink,
} from "../components";
import { categories, company, quoteLink } from "../data";
import HeroCarousel from "../HeroCarousel";

export function Home() {
  return (
    <>
      <section className="home-hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            INDUSTRIA GRÁFICA ROSA BETANIA
          </p>
          <h1>
            Tus ideas,
            <br />
            bien <em>impresas.</em>
          </h1>
          <p>
            Hay ideas que merecen tomar forma.
            <br className="desktop-break" /> Las llevamos al papel con impresión
            offset y digital, cuidando cada detalle.
          </p>
          <div className="hero-actions">
            <Button to="/productos">Ver productos</Button>
            <Button to="/cotizacion" variant="secondary" arrow={false}>
              Solicitar cotización
            </Button>
          </div>
          <div className="hero-footnote">
            <span className="registration-mark" aria-hidden="true" />
            <span>
              PRECISIÓN EN EL PROCESO.
              <br />
              PERSONALIDAD EN EL RESULTADO.
            </span>
          </div>
        </div>
        <HeroCarousel />
      </section>
      <div className="service-strip">
        <div className="container">
          <span>
            <Layers3 size={18} aria-hidden="true" />
            Impresión offset & digital
          </span>
          <span>
            <ScanLine size={18} aria-hidden="true" />
            Pruebas de color
          </span>
          <span>
            <Sparkles size={18} aria-hidden="true" />
            Ideas en cada formato
          </span>
          <Link to="/contacto">
            Desde Santa Cruz, Bolivia
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <section className="section container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LO QUE PODEMOS CREAR</p>
            <h2>
              Un mundo de posibilidades.
              <br />
              <span>Tu idea es el comienzo.</span>
            </h2>
          </div>
          <TextLink to="/productos">Explorar productos</TextLink>
        </div>
        <div className="product-preview-grid">
          {categories.map((category, index) => (
            <Link
              to={`/productos?categoria=${category.id}`}
              className="product-preview"
              key={category.id}
            >
              <div className="product-image">
                <img
                  src={`/images/${category.image}`}
                  alt={category.alt}
                  width="640"
                  height="480"
                  loading="lazy"
                />
                <span className="round-arrow">
                  <ArrowUpRight size={20} aria-hidden="true" />
                </span>
              </div>
              <span className="product-index">0{index + 1}</span>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>
      <section className="printing-preview">
        <div className="container printing-preview-inner">
          <div>
            <p className="eyebrow">EL PROCESO ADECUADO PARA TU IDEA</p>
            <h2>
              Dos formas de imprimir.
              <br />
              <em>Un mismo cuidado.</em>
            </h2>
            <p>
              Cada proyecto tiene su propio formato, cantidad y propósito. Te
              ayudamos a conocer las opciones.
            </p>
            <TextLink to="/impresion">Conoce cómo imprimimos</TextLink>
          </div>
          <div className="technique-links">
            <Link to={quoteLink(undefined, "offset")}>
              <span className="technique-number">01</span>
              <div>
                <h3>Impresión offset</h3>
                <p>
                  Para proyectos de mayor volumen
                  <br />y formatos grandes.
                </p>
              </div>
              <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link to={quoteLink(undefined, "digital")}>
              <span className="technique-number">02</span>
              <div>
                <h3>Impresión digital</h3>
                <p>
                  Para cantidades pequeñas
                  <br />y piezas personalizadas.
                </p>
              </div>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="technology-preview container section">
        <div className="machine-image">
          <img
            src="/images/carousel-press.webp"
            alt="Prensa Heidelberg Speedmaster presentada por Rosa Betania"
            width="800"
            height="570"
            loading="lazy"
          />
          <span>PRECISIÓN QUE SE VE.</span>
        </div>
        <div>
          <p className="eyebrow">DETRÁS DE CADA IMPRESIÓN</p>
          <h2>
            Tecnología al servicio
            <br />
            de tus ideas.
          </h2>
          <p>
            De la preparación del archivo al control del color. Conoce los
            equipos y procesos que acompañan cada trabajo.
          </p>
          <TextLink to="/tecnologia">Descubre nuestra tecnología</TextLink>
        </div>
      </section>
      <QuoteBanner />
    </>
  );
}

export function Products() {
  const [params, setParams] = useSearchParams();
  const selected = categories.some((c) => c.id === params.get("categoria"))
    ? params.get("categoria")!
    : "todos";
  const visible =
    selected === "todos"
      ? categories
      : categories.filter((c) => c.id === selected);
  return (
    <>
      <PageIntro
        eyebrow="NUESTROS PRODUCTOS"
        title={
          <>
            El papel de
            <br />
            <em>tus ideas.</em>
          </>
        }
      >
        Desde una tarjeta de presentación hasta una publicación. Encuentra el
        punto de partida para tu próximo proyecto.
      </PageIntro>
      <section className="catalog container" aria-label="Catálogo de productos">
        <div className="filter-bar" aria-label="Filtrar por categoría">
          {[{ id: "todos", short: "Todos" }, ...categories].map((category) => (
            <button
              type="button"
              key={category.id}
              aria-pressed={selected === category.id}
              onClick={() =>
                setParams(
                  category.id === "todos" ? {} : { categoria: category.id },
                  { preventScrollReset: true },
                )
              }
            >
              {category.short}
            </button>
          ))}
        </div>
        <p className="catalog-count" role="status">
          {visible.length === 1
            ? "1 familia de productos"
            : `${visible.length} familias de productos`}
        </p>
        <div className="catalog-grid">
          {visible.map((category) => (
            <article className="catalog-card" key={category.id}>
              <div className="catalog-image">
                <img
                  src={`/images/${category.image}`}
                  alt={category.alt}
                  width="1024"
                  height="640"
                  loading="lazy"
                />
                <span>{category.short}</span>
              </div>
              <div className="catalog-content">
                <h2>{category.name}</h2>
                <p>{category.description}</p>
                <ul className="product-tags">
                  {category.examples.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <TextLink to={quoteLink(category.id)}>
                  Cotizar este producto
                </TextLink>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="advice-strip container">
        <div>
          <h2>¿Todavía estás dando forma a tu idea?</h2>
          <p>
            No necesitas tener todas las especificaciones. Cuéntanos qué quieres
            lograr.
          </p>
        </div>
        <Button to={quoteLink(undefined, "asesoramiento")} variant="secondary">
          Necesito asesoramiento
        </Button>
      </section>
    </>
  );
}

export function Technology() {
  return (
    <>
      <PageIntro
        eyebrow="NUESTRA TECNOLOGÍA"
        title={
          <>
            El detalle empieza
            <br />
            <em>en el proceso.</em>
          </>
        }
      >
        Equipos, materiales y preparación. Conoce lo que hay detrás de un
        trabajo impreso en Rosa Betania.
      </PageIntro>
      <section className="feature-equipment container">
        <div className="equipment-heading">
          <p className="eyebrow">01 / PRENSA</p>
          <h2>Speedmaster 74</h2>
          <p>
            La prensa offset forma parte de nuestro proceso para pedidos de
            mayor volumen. Su control de colores computarizado acompaña el
            trabajo de impresión.
          </p>
          <div className="equipment-spec">
            <span>CONTROL</span>
            <strong>Colores computarizados</strong>
            <span>APLICACIÓN</span>
            <strong>Impresión offset</strong>
          </div>
          <TextLink to="/impresion">Conoce la impresión offset</TextLink>
        </div>
        <div className="equipment-photo">
          <img
            src="/images/carousel-press.webp"
            alt="Prensa Heidelberg Speedmaster presentada por Rosa Betania"
            width="900"
            height="600"
          />
          <span>Prensa Speedmaster 74 · Rosa Betania</span>
        </div>
      </section>
      <section className="equipment-secondary container section">
        <article>
          <div className="secondary-photo prepress-visual" aria-hidden="true">
            <span className="prepress-sheet prepress-sheet-back" />
            <span className="prepress-sheet prepress-sheet-middle" />
            <span className="prepress-sheet prepress-sheet-front">
              <i />
              <i />
              <i />
              <b>CTP</b>
            </span>
          </div>
          <p className="eyebrow">02 / PREPRENSA</p>
          <h2>
            Todo empieza antes
            <br />
            de imprimir.
          </h2>
          <p>
            La preprensa CTP Heidelberg permite preparar el trabajo con un
            control automatizado del diseño. Una etapa que conecta el archivo
            con la impresión offset.
          </p>
        </article>
        <article>
          <div className="secondary-photo">
            <img
              src="/images/color-proof.webp"
              width="650"
              height="440"
              loading="lazy"
              alt="Tira de control y muestras impresas para revisar el color"
            />
          </div>
          <p className="eyebrow">03 / INSUMOS</p>
          <h2>
            La elección del material
            <br />
            también deja huella.
          </h2>
          <p>
            El sitio de Rosa Betania presenta placas y tintas de industria
            alemana y papeles de industria sueca. Consulta los materiales
            disponibles para tu proyecto al cotizar.
          </p>
        </article>
      </section>
      <ColorProof />
      <QuoteBanner />
    </>
  );
}

function ColorProof() {
  return (
    <section className="color-proof">
      <div className="container color-proof-inner">
        <div className="proof-image">
          <img
            src="/images/color-proof.webp"
            alt="Muestra del servicio de prueba de color"
            width="650"
            height="420"
            loading="lazy"
          />
        </div>
        <div>
          <p className="eyebrow">ANTES DE DAR EL SIGUIENTE PASO</p>
          <h2>
            Ve el color.
            <br />
            <em>Antes de imprimir.</em>
          </h2>
          <p>
            La prueba de color te permite visualizar los colores de tu trabajo
            antes de la impresión. Una muestra para revisar el diseño y detectar
            posibles errores.
          </p>
          <TextLink to={quoteLink(undefined, "asesoramiento")}>
            Consultar por una prueba de color
          </TextLink>
        </div>
      </div>
    </section>
  );
}

const comparison = [
  [
    "Volumen del pedido",
    "Orientada a pedidos grandes.",
    "Orientada a pedidos pequeños.",
  ],
  [
    "Personalización",
    "Consulta las posibilidades de tu proyecto.",
    "Permite personalizar las piezas.",
  ],
  ["Formatos", "Formatos grandes.", "Formatos medianos."],
  [
    "Tiempos",
    "La empresa indica tiempos medios.",
    "La empresa indica tiempos más cortos.",
  ],
];
export function Printing() {
  return (
    <>
      <PageIntro
        eyebrow="IMPRESIÓN OFFSET & DIGITAL"
        title={
          <>
            Cada proyecto,
            <br />
            <em>su forma de imprimir.</em>
          </>
        }
      >
        La cantidad, el formato y la personalización nos ayudan a elegir el
        proceso. Conoce las dos opciones y conversemos sobre tu proyecto.
      </PageIntro>
      <section className="printing-options container">
        <article>
          <div className="printing-option-image">
            <img
              src="/images/carousel-press.webp"
              width="700"
              height="450"
              alt="Prensa para impresión offset"
            />
            <span>01 / OFFSET</span>
          </div>
          <div className="printing-option-body">
            <h2>
              Para ideas
              <br />a gran escala.
            </h2>
            <p>
              La impresión offset es una opción para proyectos de mayor volumen
              y formatos grandes.
            </p>
            <ul className="check-list">
              <li>
                <Check size={17} aria-hidden="true" />
                Publicaciones de mayor tiraje
              </li>
              <li>
                <Check size={17} aria-hidden="true" />
                Papelería para pedidos grandes
              </li>
              <li>
                <Check size={17} aria-hidden="true" />
                Producción de empaques
              </li>
            </ul>
            <Button to={quoteLink(undefined, "offset")}>
              Cotizar impresión offset
            </Button>
          </div>
        </article>
        <article>
          <div className="printing-option-image">
            <img
              src="/images/papeleria.webp"
              width="700"
              height="450"
              alt="Piezas de papelería que pueden cotizarse en impresión digital"
            />
            <span>02 / DIGITAL</span>
          </div>
          <div className="printing-option-body">
            <h2>
              Pequeños tirajes.
              <br />
              Muchas posibilidades.
            </h2>
            <p>
              La impresión digital permite trabajar cantidades pequeñas y
              personalizar productos.
            </p>
            <ul className="check-list">
              <li>
                <Check size={17} aria-hidden="true" />
                Papelería en pequeñas cantidades
              </li>
              <li>
                <Check size={17} aria-hidden="true" />
                Ediciones cortas de publicaciones
              </li>
              <li>
                <Check size={17} aria-hidden="true" />
                Empaques con diseños diferentes
              </li>
            </ul>
            <Button to={quoteLink(undefined, "digital")}>
              Cotizar impresión digital
            </Button>
          </div>
        </article>
      </section>
      <section className="comparison-section container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">UNA GUÍA PARA EMPEZAR</p>
            <h2>Encuentra tu punto de partida.</h2>
          </div>
          <ArrowDown className="section-arrow" size={30} aria-hidden="true" />
        </div>
        <div className="comparison-table-wrap">
          <table className="comparison-table">
            <caption className="sr-only">
              Comparación de impresión offset y digital según el sitio de Rosa
              Betania
            </caption>
            <thead>
              <tr>
                <th scope="col">Tu proyecto</th>
                <th scope="col">Impresión offset</th>
                <th scope="col">Impresión digital</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row[0]}>
                  <th scope="row">{row[0]}</th>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="comparison-note">
          Orientación basada en los servicios publicados por Rosa Betania.
          Formatos exactos, disponibilidad y plazo de entrega se confirman al
          evaluar cada trabajo.
        </p>
        <div className="comparison-help">
          <p>¿No sabes qué técnica elegir? Podemos empezar por tu idea.</p>
          <TextLink to={quoteLink(undefined, "asesoramiento")}>
            Necesito asesoramiento
          </TextLink>
        </div>
      </section>
      <ColorProof />
      <QuoteBanner />
    </>
  );
}

export function Contact() {
  return (
    <>
      <PageIntro
        eyebrow="CONTACTO"
        title={
          <>
            Las buenas ideas
            <br />
            <em>empiezan conversando.</em>
          </>
        }
      >
        Estamos en Santa Cruz de la Sierra. Llámanos o visítanos para conversar
        sobre tu próximo proyecto.
      </PageIntro>
      <section className="contact-layout container">
        <div className="contact-details">
          <div className="contact-item">
            <MapPin size={23} aria-hidden="true" />
            <div>
              <p className="eyebrow">VEN A VISITARNOS</p>
              <h2>{company.address}</h2>
              <p>
                Entre Tarija y Cobija
                <br />
                Santa Cruz, Bolivia
              </p>
              <a
                className="text-link"
                href={company.maps}
                target="_blank"
                rel="noreferrer"
              >
                Abrir en Google Maps
                <ArrowUpRight size={18} aria-hidden="true" />
                <span className="sr-only"> (abre en otra pestaña)</span>
              </a>
            </div>
          </div>
          <div className="contact-item">
            <Phone size={23} aria-hidden="true" />
            <div>
              <p className="eyebrow">HABLEMOS DE TU PROYECTO</p>
              <a className="large-phone" href={company.phoneHref}>
                {company.phone}
              </a>
              <p>Teléfono de atención</p>
            </div>
          </div>
          <ContactHours />
        </div>
        <div className="location-panel">
          <div className="map-art" aria-hidden="true">
            <span className="street street-one">Calle Tarija</span>
            <span className="street street-two">Calle Cobija</span>
            <span className="street street-main">Calle Ñuflo de Chávez</span>
            <span className="map-block block-one" />
            <span className="map-block block-two" />
            <span className="map-block block-three" />
            <span className="map-block block-four" />
            <div className="map-pin">
              <MapPin size={30} />
              <span>rosa betania</span>
              <small>Industria Gráfica</small>
            </div>
            <span className="map-north">N ↑</span>
          </div>
          <div className="location-caption">
            <div>
              <span>SANTA CRUZ DE LA SIERRA</span>
              <p>Te esperamos en el #572.</p>
              <small>Esquema de referencia, no a escala.</small>
            </div>
            <a
              href={company.maps}
              aria-label="Consultar ubicación en Google Maps (abre en otra pestaña)"
              target="_blank"
              rel="noreferrer"
            >
              <ArrowUpRight size={26} />
            </a>
          </div>
        </div>
      </section>
      <div className="contact-social container">
        <span>También estamos en Facebook</span>
        <a
          className="text-link"
          href={company.facebook}
          target="_blank"
          rel="noreferrer"
        >
          Rosa Betania Industria Gráfica
          <ArrowUpRight size={17} aria-hidden="true" />
          <span className="sr-only"> (abre en otra pestaña)</span>
        </a>
      </div>
      <section className="contact-project container">
        <div>
          <p className="eyebrow">¿TIENES UN TRABAJO EN MENTE?</p>
          <h2>Cuéntanos los detalles.</h2>
          <p>
            Prepara tu solicitud con la información de tu proyecto para
            compartirla con nuestro equipo.
          </p>
        </div>
        <Button to="/cotizacion">Preparar cotización</Button>
      </section>
    </>
  );
}
