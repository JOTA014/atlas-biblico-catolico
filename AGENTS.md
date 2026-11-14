# Atlas Biblico Catolico

## Project overview

- The application uses Angular for the responsive web client and ASP.NET Core on .NET 10 for the API and production host.
- `api/content/atlas.json` contains catalog-wide metadata. `api/content/books/{slug}.json` is the canonical source for each of the 73 Catholic Bible books.
- Keep the Catholic canon at 46 Old Testament books and 27 New Testament books.
- The three reading levels are `descubrir`, `comprender`, and `investigar`. Keep the six shared section IDs consistent across all three levels of each book.
- The API serves the Angular app and exposes the catalog, overview, book, level, and source endpoints under `/api`.

## Editorial requirements

- Treat historical authorship, dating, audience, and composition as claims with varying levels of certainty. Preserve each book's certainty label and source URL; distinguish tradition, explicit textual evidence, and scholarly debate.
- Do not present a traditional attribution as settled historical fact when the evidence is disputed. Do not invent a specific audience when the source does not support one.
- Keep Catholic interpretation consistent with *Dei Verbum* and the Catechism, while distinguishing doctrine, tradition, literary context, and academic hypotheses.
- The three Genesis PDFs are pilot drafts. Do not imply that equivalent prebuilt PDFs exist for all 73 books; other routes can be printed from the web reader.

## Local verification

- API: `dotnet build api/MapaBiblico.Api.csproj -c Release`
- Catalog checks: from `ui/`, run `npm run test:content`.
- Production UI build: from `ui/`, run `npm run build`.
- Docker image: build from the repository root using `docker build -t atlas-biblico-catolico .`.

## Deployment

- `render.yaml` deploys the Docker service from `master` and checks `/api/overview`.
- Keep the API and Angular app in the same container and origin unless deployment configuration is intentionally changed.

