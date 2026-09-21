import test from "node:test";
import assert from "node:assert/strict";
import {
  createQuoteSummary,
  emptyQuote,
  readQuoteSelection,
  validateQuote,
} from "../src/quote.ts";

const validQuote = {
  ...emptyQuote,
  name: "Ana Pérez",
  email: "ana@example.com",
  phone: "+591 7000 0000",
  category: "editorial",
  printType: "digital",
  quantity: "200",
  description: "Revista de la empresa, 24 páginas.",
};

test("URL selection survives a serialized URL and rejects unrecognized values", () => {
  const url = new URL(
    "https://example.com/cotizacion?producto=editorial&tipo=digital",
  );
  assert.deepEqual(readQuoteSelection(new URL(url.href).searchParams), {
    category: "editorial",
    printType: "digital",
  });
  assert.deepEqual(
    readQuoteSelection(new URLSearchParams("producto=unknown&tipo=unknown")),
    { category: "", printType: "asesoramiento" },
  );
  assert.deepEqual(readQuoteSelection(new URLSearchParams()), {
    category: "",
    printType: "asesoramiento",
  });
});

test("required fields identify exactly what a client must supply", () => {
  const errors = validateQuote(emptyQuote);
  assert.deepEqual(Object.keys(errors), [
    "name",
    "email",
    "phone",
    "category",
    "quantity",
    "description",
  ]);
  assert.ok(
    validateQuote({ ...validQuote, name: "  ", description: "\n " }).name,
  );
  assert.ok(
    validateQuote({ ...validQuote, name: "  ", description: "\n " })
      .description,
  );
});

test("advisory requests do not need any technical specifications", () => {
  assert.deepEqual(
    validateQuote({ ...validQuote, printType: "asesoramiento" }),
    {},
  );
  assert.deepEqual(validateQuote(validQuote), {});
});

test("rejects malformed contact information and forged category/type selections", () => {
  for (const email of [
    "ana",
    "ana@",
    "ana@example",
    "ana @example.com",
    "a@@example.com",
  ]) {
    assert.ok(validateQuote({ ...validQuote, email }).email, email);
  }
  for (const phone of ["llámame", "123", "123abc456", "+1234567890123456"]) {
    assert.ok(validateQuote({ ...validQuote, phone }).phone, phone);
  }
  assert.deepEqual(
    validateQuote({
      ...validQuote,
      email: " ana@example.com ",
      phone: "(591) 7000-0000",
    }),
    {},
  );
  assert.ok(validateQuote({ ...validQuote, category: "unknown" }).category);
  assert.ok(validateQuote({ ...validQuote, printType: "unknown" }).printType);
});

test("quantity must be a positive safe integer, including advisory requests", () => {
  for (const quantity of [
    "",
    "0",
    "-1",
    "1.5",
    "1e3",
    "Infinity",
    "NaN",
    "9007199254740992",
  ]) {
    assert.ok(
      validateQuote({ ...validQuote, quantity, printType: "asesoramiento" })
        .quantity,
      quantity,
    );
  }
  for (const quantity of ["1", "250", "10000"])
    assert.deepEqual(validateQuote({ ...validQuote, quantity }), {});
});

test("summary contains entered details, understandable labels, and honest delivery status", () => {
  const summary = createQuoteSummary({
    ...validQuote,
    date: "2026-12-01",
    dimensions: "A4",
    company: "Editorial ejemplo",
  });
  assert.match(summary, /Este archivo no ha sido enviado a la empresa\./);
  assert.match(summary, /Nombre: Ana Pérez/);
  assert.match(summary, /Empresa: Editorial ejemplo/);
  assert.match(summary, /Categoría: Libros, revistas y memorias/);
  assert.match(summary, /Tipo de impresión: Digital/);
  assert.match(summary, /Cantidad: 200 unidades/);
  assert.match(summary, /Tamaño o dimensiones: A4/);
  assert.match(summary, /Material o papel: Por definir/);
  assert.match(summary, /Fecha deseada: 01\/12\/2026/);
  assert.match(summary, /Revista de la empresa, 24 páginas\./);
  assert.match(
    summary,
    /Coordina con la empresa la entrega de esta solicitud\./,
  );
});
