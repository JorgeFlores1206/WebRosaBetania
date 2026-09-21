import { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer, Header, Button } from "./components";
import { Home, Technology, Products, Printing, Contact } from "./pages/Pages";
import Quote from "./pages/Quote";
import { usePageMotion } from "./usePageMotion";

const metadata: Record<string, [string, string]> = {
  "/": [
    "Ideas que toman forma",
    "Industria Gráfica Rosa Betania: impresión offset y digital, papelería, publicaciones, empaques e invitaciones en Santa Cruz, Bolivia.",
  ],
  "/tecnologia": [
    "Tecnología de impresión",
    "Conoce la prensa Speedmaster 74, la preprensa CTP y el servicio de prueba de color de Rosa Betania.",
  ],
  "/productos": [
    "Productos impresos",
    "Explora papelería corporativa, libros, revistas, memorias, empaques, bolsas, adhesivos e invitaciones.",
  ],
  "/impresion": [
    "Impresión offset y digital",
    "Compara impresión offset y digital y encuentra orientación para tu proyecto con Rosa Betania.",
  ],
  "/cotizacion": [
    "Solicita tu cotización",
    "Prepara y descarga los detalles de tu solicitud de impresión para compartirlos con Industria Gráfica Rosa Betania.",
  ],
  "/contacto": [
    "Contacto y ubicación",
    "Dirección, teléfono y horarios de atención de Industria Gráfica Rosa Betania en Santa Cruz de la Sierra, Bolivia.",
  ],
};
export default function App() {
  const { pathname, search } = useLocation();
  usePageMotion(pathname, pathname === "/productos" ? search : "");
  const previous = useRef(pathname);
  useEffect(() => {
    const meta = metadata[pathname] ?? [
      "Página no encontrada",
      "Encuentra los servicios y productos de Industria Gráfica Rosa Betania.",
    ];
    document.title = `${meta[0]} | Rosa Betania`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta[1]);
    if (previous.current !== pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.getElementById("main")?.focus({ preventScroll: true });
      previous.current = pathname;
    }
  }, [pathname]);
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <div className="page-stage" key={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tecnologia" element={<Technology />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/impresion" element={<Printing />} />
            <Route path="/cotizacion" element={<Quote />} />
            <Route path="/contacto" element={<Contact />} />
            <Route
              path="*"
              element={
                <section className="not-found container">
                  <p className="eyebrow">ERROR 404</p>
                  <h1>
                    Esta página
                    <br />
                    quedó en blanco.
                  </h1>
                  <p>
                    La dirección que buscas no existe. Volvamos a dar forma a
                    tus ideas.
                  </p>
                  <Button to="/">Volver al inicio</Button>
                </section>
              }
            />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  );
}
