# Atlas Bíblico Católico

Material didáctico original para orientarse en los 73 libros del canon católico. Cada libro ofrece tres recorridos —Descubrir, Comprender e Investigar—, secciones con anclajes estables, referencias editoriales y avance guardado localmente.

La edición actual es de trabajo. Los 73 libros tienen contenido inicial; no todos han pasado por revisión bíblica especializada. Los recorridos amplían de manera pedagógica las síntesis y notas existentes, por lo que no deben tratarse como comentario académico ni como aprobación eclesial.

## Stack

- ASP.NET Core / .NET 10 para API y alojamiento de la aplicación.
- Angular 22 para la interfaz adaptable a móvil.
- Node.js 24 para construir y verificar la interfaz y el catálogo.
- Docker para publicación en servicios que ejecuten contenedores.

## Ejecutar localmente

Requisitos: .NET 10 SDK, Node.js 24.15 o posterior, npm.

```sh
cd ui
npm ci
npm start
```

En otra terminal inicia la API desde `api/` con `dotnet run`. Angular queda disponible en `http://localhost:4200`; el proxy reenvía `/api` a ASP.NET Core en `http://localhost:5080`.

## Verificar

```sh
cd ui
npm run test:content
npm run build
```

La prueba de contenido valida el canon 46/27, las tres rutas y sus IDs de sección compartidos, el estado editorial y la presencia de los PDFs de Génesis.

## API

- `GET /api/health` — comprobación de servicio.
- `GET /api/overview` — título, canon y estado de edición.
- `GET /api/atlas` — catálogo, contenido, rutas y fuentes desde el documento editorial canónico.
- `GET /api/books?q=&group=&testament=` — búsqueda y filtros del catálogo.
- `GET /api/books/{slug}` — ficha y recorridos de un libro.
- `GET /api/books/{slug}/levels/{levelId}` — recorrido de un libro.
- `GET /api/sources` — fuentes comunes.

## Contenido y progreso

`api/content/atlas.json` guarda los datos generales del catálogo y `api/content/books/` contiene un archivo JSON por libro. Juntos son la fuente estructurada que alimenta la API y la web. Definen los tres recorridos, los IDs compartidos entre niveles, las fuentes y el estado editorial. Cada ruta usa seis secciones estables: panorama, lugar en la Biblia, contexto, lectura guiada, encuentro en grupo y autoría/destinatarios. Las atribuciones y audiencias declaran su carácter tradicional, textual o debatido y enlazan a la introducción específica del libro.

El avance y la preferencia de recorrido se guardan en `localStorage` con claves versionadas. No se envían al servidor ni se sincronizan entre dispositivos. Si el almacenamiento del navegador está bloqueado, el resto de la lectura sigue disponible durante la sesión.

El PDF panorámico existente resume la colección. Los tres PDFs de recorrido descargables son del piloto de Génesis y permanecen etiquetados como borradores. Para los demás libros, se puede usar “Imprimir / Guardar como PDF” desde el recorrido abierto.

## Crear contenedor

Desde la raíz:

```sh
docker build -t atlas-biblico-catolico .
docker run --rm -p 8080:8080 atlas-biblico-catolico
```

## Despliegue de prueba

`render.yaml` conserva el servicio Docker gratuito ya configurado. El servicio es de prueba; consulta el panel de Render para límites actuales de tráfico, horas y suspensión por inactividad. El contenido y el avance local no necesitan base de datos.

## Criterios editoriales

Se distingue la síntesis pedagógica del texto bíblico citado, la doctrina católica, la tradición interpretativa y las propuestas académicas. Las introducciones de USCCB son comentarios editoriales útiles, no definiciones doctrinales. Sigue *Dei Verbum* 12 y el Catecismo 109–119 al atender a género, intención, contexto, unidad de la Escritura y Tradición.

Fuentes y revisión: [docs/auditoria-editorial.md](docs/auditoria-editorial.md), [docs/diagnostico-y-arquitectura.md](docs/diagnostico-y-arquitectura.md), [docs/revision-publica-mapas-de-la-palabra.md](docs/revision-publica-mapas-de-la-palabra.md).

