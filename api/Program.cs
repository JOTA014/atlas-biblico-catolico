using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

var app = builder.Build();
app.UseDefaultFiles();
app.UseStaticFiles();

var contentPath = Path.Combine(AppContext.BaseDirectory, "content");
using var catalogDocument = JsonDocument.Parse(await File.ReadAllTextAsync(Path.Combine(contentPath, "atlas.json")));
var catalog = catalogDocument.RootElement.Clone();
var booksPath = Path.Combine(contentPath, "books");
var books = Directory.GetFiles(booksPath, "*.json")
    .Select(ReadJson)
    .OrderBy(book => book.GetProperty("order").GetInt32())
    .ToArray();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));
app.MapGet("/api/overview", () => Results.Ok(new
{
    title = catalog.GetProperty("title").GetString(),
    totalBooks = catalog.GetProperty("counts").GetProperty("total").GetInt32(),
    oldTestamentBooks = catalog.GetProperty("counts").GetProperty("oldTestament").GetInt32(),
    newTestamentBooks = catalog.GetProperty("counts").GetProperty("newTestament").GetInt32(),
    edition = catalog.GetProperty("edition").GetString()
}));
app.MapGet("/api/atlas", () => Results.Ok(new
{
    title = catalog.GetProperty("title"),
    version = catalog.GetProperty("version"),
    edition = catalog.GetProperty("edition"),
    disclaimer = catalog.GetProperty("disclaimer"),
    counts = catalog.GetProperty("counts"),
    editorialCriteria = catalog.GetProperty("editorialCriteria"),
    sources = catalog.GetProperty("sources"),
    books
}));
app.MapGet("/api/sources", () => Results.Ok(catalog.GetProperty("sources")));
app.MapGet("/api/books", (string? q, string? group, string? testament) =>
{
    IEnumerable<JsonElement> result = books;
    if (!string.IsNullOrWhiteSpace(q))
        result = result.Where(book => string.Join(' ', Get(book, "title"), Get(book, "group"), Get(book, "summary"), Get(book, "role"))
            .Contains(q.Trim(), StringComparison.CurrentCultureIgnoreCase));
    if (!string.IsNullOrWhiteSpace(group))
        result = result.Where(book => Get(book, "group").Equals(group, StringComparison.CurrentCultureIgnoreCase));
    if (!string.IsNullOrWhiteSpace(testament))
        result = result.Where(book => Get(book, "testament").Equals(testament, StringComparison.CurrentCultureIgnoreCase));
    return Results.Ok(result.ToArray());
});
app.MapGet("/api/books/{slug}", (string slug) =>
    books.FirstOrDefault(book => Get(book, "slug").Equals(slug, StringComparison.OrdinalIgnoreCase)) is { ValueKind: not JsonValueKind.Undefined } book
        ? Results.Ok(book)
        : Results.NotFound());
app.MapGet("/api/books/{slug}/levels/{levelId}", (string slug, string levelId) =>
{
    var book = books.FirstOrDefault(item => Get(item, "slug").Equals(slug, StringComparison.OrdinalIgnoreCase));
    if (book.ValueKind == JsonValueKind.Undefined) return Results.NotFound();
    var level = book.GetProperty("levels").EnumerateArray()
        .FirstOrDefault(item => Get(item, "id").Equals(levelId, StringComparison.OrdinalIgnoreCase));
    return level.ValueKind == JsonValueKind.Undefined ? Results.NotFound() : Results.Ok(level);
});

app.MapFallbackToFile("index.html");
app.Run();

static string Get(JsonElement item, string property) => item.TryGetProperty(property, out var value) ? value.GetString() ?? "" : "";

static JsonElement ReadJson(string path)
{
    using var document = JsonDocument.Parse(File.ReadAllText(path));
    return document.RootElement.Clone();
}

