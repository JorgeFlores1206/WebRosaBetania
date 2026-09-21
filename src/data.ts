export const navigation = [
  { to: "/", label: "Inicio" },
  { to: "/tecnologia", label: "Tecnología" },
  { to: "/productos", label: "Productos" },
  { to: "/impresion", label: "Impresión" },
  { to: "/cotizacion", label: "Cotización" },
  { to: "/contacto", label: "Contacto" },
];
export const categories = [
  {
    id: "papeleria",
    name: "Papelería corporativa",
    short: "Papelería",
    image: "papeleria.webp",
    alt: "Muestras de tarjetas, hojas y papelería corporativa",
    description:
      "Una identidad que se reconoce en cada detalle. Dale a tu marca una presentación coherente en papel.",
    examples: [
      "Tarjetas personales",
      "Hojas membretadas",
      "Folletos",
      "Carpetas de presentación",
      "Catálogos",
    ],
  },
  {
    id: "editorial",
    name: "Libros, revistas y memorias",
    short: "Editorial",
    image: "editorial.webp",
    alt: "Selección de publicaciones y piezas editoriales",
    description:
      "Historias, conocimiento e ideas que merecen ser leídos. Impresión para tus proyectos editoriales.",
    examples: ["Libros", "Revistas", "Memorias", "Cuadernos", "Periódicos"],
  },
  {
    id: "empaques",
    name: "Empaques, bolsas y adhesivos",
    short: "Empaques",
    image: "empaques.webp",
    alt: "Ejemplos de cajas, bolsas y empaques impresos",
    description:
      "El primer encuentro con tu producto empieza por su presentación. Encuentra el soporte para tu marca.",
    examples: [
      "Cajas para alimentos",
      "Empaques farmacéuticos",
      "Cajas para vinos",
      "Bolsas de papel",
      "Adhesivos para etiquetas",
    ],
  },
  {
    id: "invitaciones",
    name: "Invitaciones",
    short: "Invitaciones",
    image: "invitaciones.webp",
    alt: "Invitación impresa para una ocasión especial",
    description:
      "El comienzo de una ocasión especial. Invitaciones personalizadas que dan forma a lo que quieres compartir.",
    examples: [
      "Invitaciones personalizadas",
      "Invitaciones para bodas",
      "Invitaciones para eventos sociales",
    ],
  },
];
export const company = {
  phone: "3 336 0881",
  phoneHref: "tel:+59133360881",
  address: "Calle Ñuflo de Chávez #572",
  addressDetail: "Entre Tarija y Cobija · Santa Cruz, Bolivia",
  maps: "https://www.google.com/maps/search/?api=1&query=-17.785015721485365%2C-63.17504527670383",
  facebook: "https://www.facebook.com/rosabetaniaindustriagrafica/",
  weekdays: "08:00–12:30 y 14:30–19:00",
  saturday: "08:00–13:00",
};
export const quoteLink = (category?: string, type?: string) => {
  const params = new URLSearchParams();
  if (category) params.set("producto", category);
  if (type) params.set("tipo", type);
  return `/cotizacion${params.size ? `?${params}` : ""}`;
};
