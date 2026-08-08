// Datos de la carta y demás contenido del sitio
// Precios orientativos — sustituir por PVP real del restaurante.

const MENU = {
  chacinas: {
    label: "Chacinas",
    images: ["images/menu-stock/menu-tabla-ibericos.webp", "images/jamon-soporte.png", "images/menu-stock/menu-cana-presa.webp"],
    items: [
      { name: "Tabla de ibéricos de la casa", desc: "Jamón, lomo, caña y chorizo de bellota.", price: "22,00€" },
      { name: "Jamón 100% bellota D.O.P. Jabugo", desc: "Cortado a cuchillo en sala.", price: "26,00€", tag: "D.O.P." },
      { name: "Caña de presa de bellota", desc: "Veteado fino, curación lenta.", price: "18,00€" },
    ],
  },
  panes: {
    label: "Panes y salmorejo",
    images: ["images/menu-stock/menu-pan-jamon.webp", "images/menu-stock/menu-pan-lomo-orza.webp", "images/panes-anchoas.png", "images/menu-stock/menu-pan-bacalao.webp"],
    items: [
      { name: "Con jamón de bellota", desc: "Pan tostado, salmorejo y jamón ibérico.", price: "9,80€" },
      { name: "Con lomo de orza", desc: "Lomo en aceite y especias.", price: "9,50€" },
      { name: "Con queso de cabra y anchoas", desc: "Queso cremoso y anchoa del Cantábrico.", price: "10,20€" },
      { name: "Con bacalao ahumado", desc: "Lascas finas sobre salmorejo.", price: "10,50€" },
    ],
  },
  huevos: {
    label: "Con dos huevos",
    images: ["images/menu-stock/menu-revuelto-boletus.webp", "images/huevos-jamon.png", "images/menu-stock/menu-huevos-lomo.webp"],
    items: [
      { name: "Revuelto de boletus", desc: "Boletus al ajillo y huevo al punto.", price: "13,90€" },
      { name: "Huevos rotos con jamón", desc: "Patata casera, huevo y jamón ibérico.", price: "14,50€", tag: "Top" },
      { name: "Huevos fritos con lomo de orza", desc: "Patata frita, huevo de corral.", price: "13,20€" },
    ],
  },
  guisos: {
    label: "Guisos",
    images: ["images/carrilleras.png", "images/menu-stock/menu-albondigas-setas.webp", "images/menu-stock/menu-secreto-tomate.webp", "images/menu-stock/menu-croquetas-jamon.webp"],
    items: [
      { name: "Carrilleras al vino tinto", desc: "Seis horas a fuego bajo. Nuestro guiso insignia.", price: "17,50€", tag: "Casa" },
      { name: "Albóndigas de cerdo ibérico", desc: "Salsa de setas de temporada.", price: "15,80€" },
      { name: "Secreto con tomate y piquillo", desc: "Secreto ibérico y verduras asadas.", price: "16,90€" },
      { name: "Croquetas caseras de jamón", desc: "Seis unidades, masa cremosa.", price: "11,80€" },
    ],
  },
  mar: {
    label: "Del mar",
    images: ["images/menu-stock/menu-bacalao-plancha.webp", "images/menu-stock/menu-bacalao-riojana.webp", "images/menu-stock/menu-bacalao-confitado.webp"],
    items: [
      { name: "Bacalao a la plancha", desc: "Lomo grueso, piel crujiente.", price: "19,50€" },
      { name: "Bacalao a la riojana", desc: "Sofrito de pimientos rojos.", price: "19,80€" },
      { name: "Bacalao «Del Tinto al Odiel»", desc: "Receta propia, confitado.", price: "21,00€", tag: "Casa" },
    ],
  },
  parrilla: {
    label: "Parrilla",
    images: ["images/menu-stock/menu-presa-iberica.webp", "images/solomillo.png", "images/menu-stock/menu-secreto-iberico.webp", "images/menu-stock/menu-chuletas-cordero.webp", "images/entrecot.png"],
    items: [
      { name: "Presa ibérica", desc: "Brasa de encina y flor de sal.", price: "18,50€" },
      { name: "Solomillo ibérico", desc: "Pieza entera, guarnición casera.", price: "19,80€" },
      { name: "Secreto ibérico", desc: "Veta de bellota a fuego vivo.", price: "17,90€" },
      { name: "Chuletas de cordero lechal", desc: "Lechal a la brasa con flor de sal.", price: "22,50€" },
      { name: "Entrecot de vacuno", desc: "Vacuno mayor madurado.", price: "23,80€", tag: "Top" },
    ],
  },
  postres: {
    label: "Postres",
    images: ["images/menu-stock/menu-arroz-leche.webp", "images/flan-castana.png", "images/menu-stock/menu-tarta-queso.webp", "images/menu-stock/menu-natillas.webp"],
    items: [
      { name: "Arroz con leche", desc: "Costra de canela tostada al momento.", price: "5,80€" },
      { name: "Flan de castaña", desc: "Castaña de la Sierra y helado.", price: "6,50€", tag: "Sierra" },
      { name: "Tarta de queso al horno", desc: "Con mermelada de la casa.", price: "6,80€" },
      { name: "Natillas caramelizadas", desc: "Quemadas en sala.", price: "5,50€" },
    ],
  },
};

const MENU_ORDER = ["chacinas", "panes", "huevos", "guisos", "mar", "parrilla", "postres"];

// Reseñas reales seleccionadas de Google. Texto editado por longitud manteniendo voz original.
const REVIEWS = [
  {
    text: "Tercera vez que lo visito. No será la última. Buen producto, buen servicio y precio acorde. No cambiéis.",
    name: "Jose María Galán León",
    meta: "Local Guide · 17 reseñas",
    when: "Hace 3 meses",
  },
  {
    text: "Fuimos buscando un sitio para comer bien y acertamos. Todo estuvo buenísimo, platos bien presentados y un servicio estupendo.",
    name: "Javier Mantilla",
    meta: "Local Guide · 54 reseñas",
    when: "Hace 2 meses",
  },
  {
    text: "He venido por sus valoraciones, y hace honor a sus estrellas. Todo exquisito. Muy recomendado, como el lomo de gamo o el flan de castaña. Espectacular.",
    name: "Rafael F. Muñoz Moris",
    meta: "4 reseñas",
    when: "Hace 6 meses",
  },
  {
    text: "Tanto el dueño como la camarera prestan un servicio totalmente impecable. La carta es para todos los gustos y resulta imposible marcharse con hambre.",
    name: "María Teresa Aguilar Galindo",
    meta: "Local Guide · 9 reseñas",
    when: "Hace 9 meses",
  },
  {
    text: "El trato del personal es impecable y la comida excelente. Pedimos jamón, tabla de quesos, secreto ibérico y entrecot de ternera. Un acierto durante nuestra visita a Aracena.",
    name: "Lluís Ferrer",
    meta: "Local Guide · 67 reseñas",
    when: "Hace un año",
  },
  {
    text: "Me ha gustado mucho. Mesas separadas, se está cómodo. El camarero, de 10, todo muy bien explicado.",
    name: "Jose Manuel Gamito",
    meta: "Local Guide · 147 reseñas",
    when: "Hace 2 meses",
  },
  {
    text: "Restaurante acogedor, con detalles muy cuidados en la decoración. Todo lo que probamos nos gustó mucho y los postres, para chuparse los dedos.",
    name: "Aída Muñoz Carmona",
    meta: "Local Guide · 29 reseñas",
    when: "Hace 3 años",
  },
  {
    text: "Todo espectacular. Pedimos varias cosas y todo muy, muy, muy bueno.",
    name: "Lola Quirós Gotarredona",
    meta: "Local Guide · 26 reseñas",
    when: "Hace 3 meses",
  },
];

const PAIRINGS = [
  { dish: "Carrilleras al vino", wine: "Tinto Ribera del Duero", note: "Crianza, 14 meses en barrica." },
  { dish: "Entrecot a la brasa", wine: "Rioja Reserva", note: "Tempranillo de viñedos altos." },
  { dish: "Bacalao a la riojana", wine: "Rueda Verdejo", note: "Sobre lías, fresco." },
  { dish: "Jamón de bellota", wine: "Manzanilla en rama", note: "Salinidad de Sanlúcar." },
  { dish: "Postres caseros", wine: "P.X. viejo", note: "Untuoso, largo." },
];

const GALLERY = [
  { src: "images/fachada.png", cat: "espacio", cap: "Fachada" },
  { src: "images/interior-reloj.png", cat: "espacio", cap: "Sala principal" },
  { src: "images/sala-arcos.png", cat: "espacio", cap: "Comedor de arcos" },
  { src: "images/barra-noche.png", cat: "espacio", cap: "Barra de noche" },
  { src: "images/jamon-soporte.png", cat: "producto", cap: "Jamón D.O.P. Jabugo" },
  { src: "images/pate.png", cat: "producto", cap: "Patés de la casa" },
  { src: "images/panes-anchoas.png", cat: "producto", cap: "Pan y anchoa" },
  { src: "images/ensaladilla.png", cat: "producto", cap: "Ensaladilla" },
  { src: "images/entrecot.png", cat: "plato", cap: "Entrecot a la brasa" },
  { src: "images/carrilleras.png", cat: "plato", cap: "Carrilleras al vino" },
  { src: "images/huevos-jamon.png", cat: "plato", cap: "Huevos rotos con jamón" },
  { src: "images/solomillo.png", cat: "plato", cap: "Solomillo ibérico" },
  { src: "images/flan-castana.png", cat: "plato", cap: "Flan de castaña" },
];

window.RESTAURANT_DATA = { MENU, MENU_ORDER, REVIEWS, PAIRINGS, GALLERY };
