# Mapa bíblico católico

Guía didáctica original para explorar los 73 libros del canon católico, seguir una cronología orientativa y contextualizar cada pasaje. El proyecto usa ASP.NET Core Web API y Angular.

## Stack

- ASP.NET Core / .NET 10 LTS para la API y el alojamiento de los archivos Angular.
- Angular 22 para la interfaz adaptable a móvil.
- Node.js 24.15 o posterior compatible con Angular 22.
- Docker para publicar la aplicación en un proveedor que ejecute contenedores.

Se eligió .NET 10 por su soporte LTS hasta noviembre de 2028; Angular 22 está en soporte activo y su compatibilidad oficial indica Node 22.22.3, 24.15 o 26, TypeScript 6.0 y RxJS 6.5.3 o 7.4. Como despliegue reproducible se usa Node 24.15. Fuentes: [política de soporte .NET](https://dotnet.microsoft.com/en-us/platform/support/policy) y [versiones compatibles de Angular](https://angular.dev/reference/versions).

## Ejecutar localmente

Requisitos: SDK de .NET 10, Node.js 24.15+, npm y Angular CLI 22.

1. En `ui/`, ejecuta `npm ci` y `npm start`.
2. En otra terminal, dentro de `api/`, ejecuta `dotnet run`.
3. La configuración proxy de Angular reenvía `/api` a ASP.NET Core en `http://localhost:5080`.

La aplicación Angular queda en `http://localhost:4200`. ASP.NET Core sirve la aplicación compilada desde `wwwroot` en producción y expone la API bajo `/api`.

## Crear imagen de contenedor

Desde la raíz del proyecto:

```sh
docker build -t mapa-biblico-catolico .
docker run --rm -p 8080:8080 mapa-biblico-catolico
```

La imagen sirve la web y la API en el mismo origen. El sitio está listo para desplegarse en un proveedor compatible con contenedores; el destino público queda pendiente de elegir.

## API

- `GET /api/overview` — canon y contexto de lectura.
- `GET /api/books` — fichas de los 73 libros; admite `q`, `group` y `testament`.
- `GET /api/books/{slug}` — ficha individual.
- `GET /api/timeline` — hitos históricos orientativos.
- `GET /api/sources` — referencias eclesiales y notas editoriales.

## Base editorial y límites

La guía distingue la descripción del texto de las reconstrucciones históricas. Fechas, autorías y localizaciones se presentan con cautela si son debatidas. El enfoque católico sigue *Dei Verbum* 12 y el Catecismo de la Iglesia Católica 109–119, 120 y 128–130. No es un catecismo oficial ni afirma aprobación eclesial.

La página pública de *Mapas de la Palabra* anuncia fichas de los 73 libros, panorama bíblico, cronología, diario espiritual y un descargable imprimible. Sin el archivo del producto no se pueden validar sus resúmenes, citas, atribuciones, dataciones ni revisión doctrinal. Esta guía es original y no reproduce aquel material.

Fuentes principales:

- [Catecismo, Escritura e interpretación](https://www.vatican.va/archive/catechism_sp/p1s1c2a3_sp.html)
- [Concilio Vaticano II, *Dei Verbum*](https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651118_dei-verbum_sp.html)
- [Pontificia Comisión Bíblica, documentos](https://www.vatican.va/roman_curia/congregations/cfaith/pcb_doc_index.htm)
- [Material de referencia: *Mapas de la Palabra*](https://www.mapasdelapalabra.com/)

## Estado

El API ASP.NET Core compila con .NET 10 y la interfaz Angular compila en modo de producción con Node.js 24.15. El PDF está incluido en `ui/public/guia-biblica-catolica.pdf` para que la aplicación también lo ofrezca como descarga. La publicación de la pila completa requiere elegir un proveedor que ejecute contenedores.

La carpeta `docs/` incluye la revisión de la página pública de referencia y el fuente LaTeX de la guía.
