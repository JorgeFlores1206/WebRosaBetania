export const productIds = [
  "papeleria",
  "editorial",
  "empaques",
  "invitaciones",
] as const;
export const printTypes = ["offset", "digital", "asesoramiento"] as const;
export type PrintType = (typeof printTypes)[number];

export type QuoteValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  category: string;
  printType: string;
  quantity: string;
  dimensions: string;
  paper: string;
  finishes: string;
  date: string;
  description: string;
};

export type QuoteErrors = Partial<Record<keyof QuoteValues, string>>;

export const emptyQuote: QuoteValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  category: "",
  printType: "asesoramiento",
  quantity: "",
  dimensions: "",
  paper: "",
  finishes: "",
  date: "",
  description: "",
};

const productNames: Record<string, string> = {
  papeleria: "Papelería corporativa",
  editorial: "Libros, revistas y memorias",
  empaques: "Empaques, bolsas y adhesivos",
  invitaciones: "Invitaciones",
};
const typeNames: Record<string, string> = {
  offset: "Offset",
  digital: "Digital",
  asesoramiento: "Necesito asesoramiento",
};

export function readQuoteSelection(params: URLSearchParams) {
  const category = params.get("producto") ?? "";
  const printType = params.get("tipo") ?? "asesoramiento";
  return {
    category: productIds.some((id) => id === category) ? category : "",
    printType: printTypes.some((type) => type === printType)
      ? printType
      : "asesoramiento",
  };
}

export function validateQuote(values: QuoteValues): QuoteErrors {
  const errors: QuoteErrors = {};
  if (!values.name.trim()) errors.name = "Escribe tu nombre.";
  if (!values.email.trim()) errors.email = "Escribe tu correo electrónico.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Revisa el correo. Por ejemplo: nombre@empresa.com.";
  }
  if (!values.phone.trim()) errors.phone = "Escribe un teléfono de contacto.";
  else {
    const digits = values.phone.replace(/\D/g, "");
    if (
      !/^\+?[\d\s().-]+$/.test(values.phone.trim()) ||
      digits.length < 6 ||
      digits.length > 15
    ) {
      errors.phone =
        "Usa un teléfono válido, con código de país si corresponde.";
    }
  }
  if (!productIds.some((id) => id === values.category))
    errors.category = "Selecciona una categoría.";
  if (!printTypes.some((type) => type === values.printType))
    errors.printType = "Selecciona el tipo de impresión.";
  if (!values.quantity.trim())
    errors.quantity = "Indica la cantidad aproximada de unidades.";
  else if (
    !/^\d+$/.test(values.quantity.trim()) ||
    !Number.isSafeInteger(Number(values.quantity)) ||
    Number(values.quantity) <= 0
  ) {
    errors.quantity = "Escribe una cantidad entera mayor que cero.";
  }
  if (!values.description.trim())
    errors.description = "Cuéntanos qué necesitas imprimir.";
  return errors;
}

export function createQuoteSummary(values: QuoteValues): string {
  const optional = (value: string) => value.trim() || "Por definir";
  const date = values.date
    ? values.date.split("-").reverse().join("/")
    : "Por definir";
  return [
    "SOLICITUD DE COTIZACIÓN",
    "Industria Gráfica Rosa Betania",
    "",
    "Este archivo no ha sido enviado a la empresa.",
    "La disponibilidad, los plazos y el precio están pendientes de evaluación.",
    "",
    "DATOS DE CONTACTO",
    `Nombre: ${values.name.trim()}`,
    `Empresa: ${values.company.trim() || "No indicada"}`,
    `Correo electrónico: ${values.email.trim()}`,
    `Teléfono: ${values.phone.trim()}`,
    "",
    "DETALLES DEL TRABAJO",
    `Categoría: ${productNames[values.category] ?? "Por definir"}`,
    `Tipo de impresión: ${typeNames[values.printType] ?? "Necesito asesoramiento"}`,
    `Cantidad: ${values.quantity.trim()} unidades`,
    `Tamaño o dimensiones: ${optional(values.dimensions)}`,
    `Material o papel: ${optional(values.paper)}`,
    `Acabados: ${optional(values.finishes)}`,
    `Fecha deseada: ${date}`,
    "",
    "DESCRIPCIÓN DEL PROYECTO",
    values.description.trim(),
    "",
    "Coordina con la empresa la entrega de esta solicitud.",
    "",
  ].join("\n");
}
