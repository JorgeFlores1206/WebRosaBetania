import { useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowDownToLine,
  Check,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { categories, company } from "../data";
import {
  createQuoteSummary,
  emptyQuote,
  readQuoteSelection,
  validateQuote,
} from "../quote";
import type { QuoteErrors, QuoteValues } from "../quote";
import "../quote.css";

type Status = "idle" | "generating" | "downloaded" | "error";

function Field({
  id,
  label,
  optional,
  error,
  hint,
  wide,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`quote-field${wide ? " quote-field-wide" : ""}`}>
      <label htmlFor={id}>
        {label}{" "}
        {optional ? (
          <span className="quote-optional">(opcional)</span>
        ) : (
          <span aria-hidden="true">*</span>
        )}
      </label>
      {children}
      {hint && (
        <p className="quote-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="quote-field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function Quote() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fields, setFields] = useState<QuoteValues>({ ...emptyQuote });
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const processing = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const values = { ...fields, ...readQuoteSelection(searchParams) };
  const isGenerating = status === "generating";

  function change(field: keyof QuoteValues, value: string) {
    if (field === "category" || field === "printType") {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          const key = field === "category" ? "producto" : "tipo";
          if (value) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    } else setFields((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    if (status !== "generating") setStatus("idle");
  }

  const inputProps = (field: keyof QuoteValues, hint = false) => ({
    id: `quote-${field}`,
    name: field,
    value: values[field],
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => change(field, event.target.value),
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby":
      [
        hint ? `quote-${field}-hint` : "",
        errors[field] ? `quote-${field}-error` : "",
      ]
        .filter(Boolean)
        .join(" ") || undefined,
  });

  async function download(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (processing.current) return;
    const nextErrors = validateQuote(values);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      setStatus("idle");
      const element = formRef.current?.elements.namedItem(firstInvalid);
      if (element instanceof HTMLElement) element.focus();
      return;
    }
    processing.current = true;
    setStatus("generating");
    try {
      // Let the browser render the disabled state before creating the download.
      await new Promise<void>((resolve) =>
        window.requestAnimationFrame(() => resolve()),
      );
      const blob = new Blob(["\uFEFF", createQuoteSummary(values)], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "solicitud-rosa-betania.txt";
      document.body.appendChild(link);
      try {
        link.click();
      } finally {
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      setStatus("downloaded");
    } catch {
      setStatus("error");
    } finally {
      processing.current = false;
    }
  }

  return (
    <>
      <section className="page-intro quote-intro">
        <div className="container">
          <p className="eyebrow">COTIZACIÓN</p>
          <h1>
            Tu próximo proyecto
            <br />
            <span>empieza aquí.</span>
          </h1>
          <p>
            Cuéntanos qué tienes en mente. Reúne los detalles de tu trabajo y
            prepara una solicitud para nuestro equipo.
          </p>
        </div>
      </section>

      <section
        className="container quote-layout"
        aria-label="Preparar una solicitud de cotización"
      >
        <aside className="quote-aside">
          <div className="quote-aside-main">
            <span className="quote-aside-icon">
              <FileText size={27} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <h2>
              De la idea
              <br />
              al papel.
            </h2>
            <p>
              No necesitas tener cada detalle resuelto. Una descripción de tu
              proyecto es un buen comienzo.
            </p>
            <ol className="quote-steps">
              <li>
                <span>01</span>
                <div>
                  <strong>Cuéntanos tu idea</strong>
                  <p>Completa los datos de contacto y del trabajo.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>Descarga tu solicitud</strong>
                  <p>Guarda el resumen en tu dispositivo.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>Conversemos</strong>
                  <p>Llámanos para coordinar la entrega de tu solicitud.</p>
                </div>
              </li>
            </ol>
            <div className="quote-advice">
              <Check size={18} aria-hidden="true" />
              <p>
                Si tienes dudas sobre papel o técnica, selecciona{" "}
                <strong>«Necesito asesoramiento»</strong>.
              </p>
            </div>
          </div>
          <div className="quote-aside-contact">
            <p>¿Prefieres hablar con nosotros?</p>
            <a href={company.phoneHref}>
              <Phone size={18} aria-hidden="true" />
              {company.phone}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <span>Lunes a viernes · {company.weekdays}</span>
          </div>
        </aside>

        <form
          className="quote-form"
          ref={formRef}
          onSubmit={download}
          noValidate
          aria-busy={isGenerating}
        >
          <div className="quote-form-heading">
            <h2>Detalles de tu solicitud</h2>
            <p>
              Los campos con <span aria-hidden="true">*</span> son obligatorios.
            </p>
          </div>

          <fieldset disabled={isGenerating}>
            <legend>
              <span>01</span> Datos de contacto
            </legend>
            <div className="quote-fields">
              <Field id="quote-name" label="Nombre" error={errors.name}>
                <input
                  {...inputProps("name")}
                  autoComplete="name"
                  maxLength={120}
                  required
                  placeholder="Tu nombre completo"
                />
              </Field>
              <Field id="quote-company" label="Empresa" optional>
                <input
                  {...inputProps("company")}
                  autoComplete="organization"
                  maxLength={160}
                  placeholder="Nombre de tu empresa"
                />
              </Field>
              <Field
                id="quote-email"
                label="Correo electrónico"
                error={errors.email}
              >
                <input
                  {...inputProps("email")}
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  placeholder="nombre@empresa.com"
                />
              </Field>
              <Field id="quote-phone" label="Teléfono" error={errors.phone}>
                <input
                  {...inputProps("phone")}
                  type="tel"
                  autoComplete="tel"
                  maxLength={30}
                  required
                  placeholder="Tu número de contacto"
                />
              </Field>
            </div>
          </fieldset>

          <fieldset disabled={isGenerating}>
            <legend>
              <span>02</span> Detalles del trabajo
            </legend>
            <div className="quote-fields">
              <Field
                id="quote-category"
                label="Categoría o producto"
                error={errors.category}
              >
                <select {...inputProps("category")} required>
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                id="quote-printType"
                label="Tipo de impresión"
                error={errors.printType}
              >
                <select {...inputProps("printType")} required>
                  <option value="asesoramiento">Necesito asesoramiento</option>
                  <option value="offset">Offset</option>
                  <option value="digital">Digital</option>
                </select>
              </Field>
              <Field
                id="quote-quantity"
                label="Cantidad"
                error={errors.quantity}
                hint="Una cantidad aproximada es suficiente."
              >
                <input
                  {...inputProps("quantity", true)}
                  inputMode="numeric"
                  type="number"
                  min="1"
                  step="1"
                  required
                  placeholder="Número de unidades"
                />
              </Field>
              <Field
                id="quote-dimensions"
                label="Tamaño o dimensiones"
                optional
              >
                <input
                  {...inputProps("dimensions")}
                  maxLength={160}
                  placeholder="Ej.: A4, 21 × 29,7 cm"
                />
              </Field>
              <Field id="quote-paper" label="Material o papel" optional>
                <input
                  {...inputProps("paper")}
                  maxLength={160}
                  placeholder="Si aún no lo sabes, lo definimos juntos"
                />
              </Field>
              <Field id="quote-finishes" label="Acabados requeridos" optional>
                <input
                  {...inputProps("finishes")}
                  maxLength={240}
                  placeholder="Cuéntanos qué acabado buscas"
                />
              </Field>
              <Field
                id="quote-date"
                label="Fecha deseada"
                optional
                hint="La fecha se confirmará al evaluar el trabajo."
              >
                <input {...inputProps("date", true)} type="date" />
              </Field>
              <Field
                id="quote-description"
                label="Descripción del proyecto"
                error={errors.description}
                wide
              >
                <textarea
                  {...inputProps("description")}
                  rows={5}
                  maxLength={5000}
                  required
                  placeholder="¿Qué quieres imprimir? Cuéntanos cómo lo usarás y cualquier detalle que nos ayude a entender tu idea."
                />
              </Field>
            </div>
          </fieldset>

          <div className="quote-download-note">
            <FileText size={22} aria-hidden="true" />
            <div>
              <strong>Prepara tu solicitud para compartirla.</strong>
              <p>
                La descarga no envía la solicitud a Rosa Betania. Obtendrás un
                archivo de texto que todavía debes entregar a la empresa. Tus
                datos no se guardan en este sitio.
              </p>
            </div>
          </div>

          {Object.values(errors).some(Boolean) && (
            <p className="quote-error-summary" role="alert">
              Revisa los campos indicados para descargar tu solicitud.
            </p>
          )}
          <div className="quote-submit-row">
            <button
              className="button button-primary"
              type="submit"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <LoaderCircle
                  className="quote-spinner"
                  size={18}
                  aria-hidden="true"
                />
              ) : (
                <ArrowDownToLine size={18} aria-hidden="true" />
              )}
              {isGenerating ? "Preparando archivo…" : "Descargar solicitud"}
            </button>
            <span>Archivo de texto (.txt)</span>
          </div>

          <div className="quote-result" aria-live="polite" aria-atomic="true">
            {status === "downloaded" && (
              <div className="quote-success">
                <CheckCircle2 size={22} aria-hidden="true" />
                <div>
                  <strong>Tu solicitud está preparada.</strong>
                  <p>
                    Se inició la descarga de «solicitud-rosa-betania.txt». La
                    empresa todavía no ha recibido tu solicitud. Llama al{" "}
                    <a href={company.phoneHref}>{company.phone}</a> para
                    coordinar cómo entregarla.
                  </p>
                </div>
              </div>
            )}
            {status === "error" && (
              <p className="quote-error-summary" role="alert">
                No se pudo preparar la descarga. Tus datos siguen en el
                formulario: inténtalo de nuevo o llama al{" "}
                <a href={company.phoneHref}>{company.phone}</a>.
              </p>
            )}
          </div>
        </form>
      </section>
    </>
  );
}
