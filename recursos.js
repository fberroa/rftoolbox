// Biblioteca de lecturas: agrega un objeto por recurso y guarda el archivo.
// Campos: titulo (obligatorio), url, autor, tipo, tema, descripcion.
//
// Ejemplo (quita las // para usarlo):
// {
//   titulo: "Microwave Engineering",
//   autor: "David M. Pozar",
//   tipo: "Libro",                  // Libro, Artículo, Nota de aplicación, Norma, Hoja de datos...
//   tema: "Líneas de transmisión",  // Antenas, Filtros, Radioenlaces... (alimenta el filtro)
//   url: "recursos/pozar.pdf",      // archivo en tu sitio o enlace externo
//   descripcion: "Referencia general de circuitos y líneas de microondas."
// },

const RECURSOS = [

{
titulo: "Smith Chart",
autor: "Tōsaku Mizuhashi, Amiel R. Volpert and Phillip H. Smith",
tipo: "Diagrama",                  // Libro, Artículo, Nota de aplicación, Norma, Hoja de datos...
tema: "Impedancias",  // Antenas, Filtros, Radioenlaces... (alimenta el filtro)
url: "https://drive.google.com/file/d/1A77NhpwN8WpClWV0PWV7cG2SwAyG1lxE/view?usp=drive_link",      // archivo en tu sitio o enlace externo
descripcion: "Diagrama de Smith para impendancias."
},

{
titulo: "Antenna Theory: Analysis and design 4th Edition",
autor: "Constantine A. Balanis",
tipo: "Libro",                  // Libro, Artículo, Nota de aplicación, Norma, Hoja de datos...
tema: "Antenas",  // Antenas, Filtros, Radioenlaces... (alimenta el filtro)
url: "https://drive.google.com/file/d/1i46UAHZWOmrmY7TG73GTMVVKllEq8mRt/view?usp=drive_link",      // archivo en tu sitio o enlace externo
descripcion: "Teoría de Antenas por Constantine A. Balanis (Wiley)."
},

{
titulo: "Microstrip Filters For RF/Microwave Applications",
autor: "Jia-Sheng Hong & M. J. Lancaster",
tipo: "Libro",                  // Libro, Artículo, Nota de aplicación, Norma, Hoja de datos...
tema: "Filtros",  // Antenas, Filtros, Radioenlaces... (alimenta el filtro)
url: "https://drive.google.com/file/d/1BctpVSoWku23fV95Ufxr0q_5ryXimv_R/view?usp=drive_link",      // archivo en tu sitio o enlace externo
descripcion: "Filtros en Microstrip para aplicaciones de RF y Microondas."
},

{
titulo: "Modern RF and Microwave Filter Design (Artech House)",
autor: "Protap Pramanick & Prakash Bhartia",
tipo: "Libro",                  // Libro, Artículo, Nota de aplicación, Norma, Hoja de datos...
tema: "Filtros",  // Antenas, Filtros, Radioenlaces... (alimenta el filtro)
url: "https://drive.google.com/file/d/1HoLA55MlPibmhq-EVlwYZJEtlDCnQxyb/view?usp=drive_link",      // archivo en tu sitio o enlace externo
descripcion: "Diseño de Filtros para RF y Microondas."
},  
];
