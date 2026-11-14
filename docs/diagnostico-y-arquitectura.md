# Diagnóstico del piloto y arquitectura de la primera iteración

**Fecha de inspección:** 14 de noviembre de 2026  
**Alcance:** aplicación desplegada en `atlas-biblico-catolico.onrender.com` y archivos del piloto adjuntos en `Atlas_Biblico_Para_Codex.zip`.

## Archivos realmente inspeccionados

El ZIP adjunto contiene un segundo ZIP (`Atlas_Biblico_Catolico_Piloto.zip`), que a su vez incluye `atlas_biblico/index.html`, `README.txt` y tres PDF de Génesis. Los PDF son: Descubrir, 46,862 bytes y 2 páginas; Comprender, 47,099 bytes y 2 páginas; Investigar, 49,008 bytes y 2 páginas. No encontré copias sueltas de esos PDF en la carpeta Downloads; por tanto, no es posible compararlas con otra versión. No se deduce que estas sean la versión más reciente fuera del material recibido.

El HTML sí incluye una ficha de Génesis en tres enfoques y el registro nominal de 73 libros. El selector deja inactivos, con la etiqueta «próximamente», los otros 72. El contenido de los tres enfoques está en un objeto JavaScript dentro del mismo archivo; hay índice por secciones, búsqueda, selección de nivel, impresión y progreso por nivel guardado en `localStorage`.

## Diagnóstico de la aplicación publicada antes de esta iteración

El despliegue existente usa Angular y ASP.NET, una combinación apropiada para servir una experiencia pública y conservar la interfaz actual. Su diseño y navegación general son utilizables, pero su modelo editorial no representa el alcance del piloto recibido: abre fichas narrativas para los 73 libros, sin indicar que solo Génesis tiene contenido didáctico desarrollado. El usuario no puede cambiar entre Descubrir, Comprender e Investigar, seguir secciones equivalentes ni marcar su avance. La página presenta una guía PDF general de 20 páginas, en lugar de las tres ediciones del piloto.

El piloto de un solo HTML conserva funciones útiles y su paleta visual puede mantenerse, pero no conviene usar el archivo HTML como fuente de producción: mezcla contenido, catálogo, plantillas y comportamiento. El progreso y el nivel se guardan en el navegador; su lectura actual no tolera JSON corrupto ni excepciones de almacenamiento. Las secciones se crean con HTML dinámico y manejadores en línea, lo que dificulta el teclado, las pruebas y la evolución del contenido.

### Hallazgos editoriales del contenido de Génesis

- La secuencia temática de los tres enfoques es clara y cada uno tiene una intención distinta: catequética/práctica, histórico-bíblica y de investigación.
- El material suele marcar la incertidumbre histórica y evita presentar Génesis 1–3 como manual científico. La lectura respeta que género, composición y recepción son preguntas distintas.
- Algunas afirmaciones de composición, paralelos mesopotámicos y recepción patrística no tienen referencia puntual; una bibliografía orientativa no permite rastrear cada afirmación. Deben identificarse como propuesta de la fuente citada o reformularse como preguntas de investigación.
- Las referencias bíblicas están presentes, pero no hay aparato de notas ni señalización visual que separe el texto bíblico, la enseñanza doctrinal, la tradición interpretativa y una hipótesis académica.
- Los PDF son borradores de dos páginas: falta una página de referencias suficientemente precisa, trazabilidad por sección y nota uniforme de estado editorial.
- El paquete es un piloto: no se debe presentar el catálogo de 73 nombres como 73 estudios terminados.

## Prioridades de implementación

1. **Corregir el alcance visible:** catálogo completo de 73 títulos, estado «Piloto disponible» para Génesis y «Pendiente» para los otros 72.
2. **Recuperar la experiencia central de Génesis:** tres niveles realmente distintos, con una selección persistente, navegación por secciones y retención del mismo identificador temático al cambiar de nivel.
3. **Reunir la fuente editorial:** un JSON versionado alimentará el catálogo, los tres niveles, la web y el generador de PDF.
4. **Hacer el progreso local robusto:** validar lo que se lee de `localStorage`, conservar el avance tras recarga y declarar que no hay sincronización entre dispositivos.
5. **Dar trazabilidad al contenido:** clasificar afirmaciones y enlazar referencias bíblicas o fuentes identificables; usar etiquetas de borrador y revisión pendiente, sin insinuar aprobación eclesial.
6. **Regenerar y verificar tres PDF:** mantenerlos como ediciones piloto imprimibles desde la misma fuente estructurada.
7. **Accesibilidad y mantenimiento:** navegación por teclado, foco y etiquetas semánticas, mensajes de carga/error/vacío, pruebas automatizadas pequeñas, README y CHANGELOG.

## Arquitectura de esta iteración

- `content/atlas.json`: registro canónico de los 73 libros, disponibilidad, tres niveles de Génesis, secciones con IDs estables, categorías de interpretación y referencias.
- ASP.NET Core: expone el catálogo y el contenido editorial desde ese mismo JSON; no necesita base de datos, cuentas ni datos remotos de progreso para este piloto.
- Angular: conserva la identidad visual y obtiene el catálogo y el contenido desde el API. Los niveles comparten IDs temáticos para que cambiar de profundidad mantenga la sección activa.
- Progreso: preferencia de nivel y secciones completadas se guardan solo en el navegador actual. Los datos almacenados se validan antes de usarlos.
- PDFs: un generador reproducible crea tres documentos imprimibles a partir de `content/atlas.json`; no duplica manualmente el texto editorial.
- Revisiones: estado `draft`/`pending-review` por contenido y notas de procedencia explícitas. La revisión automatizada no equivale a revisión de un especialista ni a aprobación eclesiástica.

## Límites y decisión para fases posteriores

La base de datos, las cuentas, la sincronización, los mapas históricos interactivos, la PWA y el modo de encuentros quedan fuera de esta primera iteración: el piloto no los necesita para servir contenido público ni progreso local. La expansión a los otros libros debe ser una fase editorial con referencias y revisión, no una extrapolación de resúmenes automáticos.

La edición recibida no contiene texto íntegro de una traducción bíblica; se preservarán referencias de capítulos/versículos y enlaces, evitando incorporar traducciones comerciales sin revisar licencias. Las propuestas sobre composición e historicidad se mostrarán como hipótesis o como postura identificada de una fuente, nunca como doctrina de la Iglesia.

