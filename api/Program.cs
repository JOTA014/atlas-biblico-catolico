using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
});

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
{
    if (allowedOrigins.Length > 0)
        policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
}));

var app = builder.Build();
app.UseCors();
app.UseDefaultFiles();
app.UseStaticFiles();

var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
var booksPath = Path.Combine(AppContext.BaseDirectory, "books.json");
var books = JsonSerializer.Deserialize<List<Book>>(await File.ReadAllTextAsync(booksPath), jsonOptions) ?? [];

app.MapGet("/api/overview", () => Results.Ok(new
{
    title = "Mapa bíblico católico",
    totalBooks = books.Count,
    oldTestamentBooks = books.Count(book => book.Testament == "Antiguo Testamento"),
    newTestamentBooks = books.Count(book => book.Testament == "Nuevo Testamento"),
    readingCriteria = new[]
    {
        "Atender a la intención del autor, su época y el género literario.",
        "Leer cada pasaje en el contenido y la unidad de toda la Escritura.",
        "Leer en la Tradición viva y la analogía de la fe de la Iglesia."
    }
}));

app.MapGet("/api/books", (string? q, string? group, string? testament) =>
{
    IEnumerable<Book> result = books;
    if (!string.IsNullOrWhiteSpace(q))
        result = result.Where(book => string.Join(' ', book.Title, book.Group, book.Summary, book.Role)
            .Contains(q.Trim(), StringComparison.CurrentCultureIgnoreCase));
    if (!string.IsNullOrWhiteSpace(group))
        result = result.Where(book => book.Group.Equals(group, StringComparison.CurrentCultureIgnoreCase));
    if (!string.IsNullOrWhiteSpace(testament))
        result = result.Where(book => book.Testament.Equals(testament, StringComparison.CurrentCultureIgnoreCase));
    return Results.Ok(result);
});

app.MapGet("/api/books/{slug}", (string slug) =>
    books.FirstOrDefault(book => book.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase)) is { } book
        ? Results.Ok(book)
        : Results.NotFound());

app.MapGet("/api/timeline", () => Results.Ok(new[]
{
    new TimelineItem("Segundo milenio a. C. · marco tradicional", "Ancestros y éxodo", "Génesis–Deuteronomio narran origen, ancestros, salida de Egipto y alianza. Las fechas y detalles históricos se estudian y debaten."),
    new TimelineItem("c. 1000–586 a. C.", "Reinos y profetas", "Monarquía, división entre Israel y Judá, profetas y caída de Jerusalén ante Babilonia en 586 a. C."),
    new TimelineItem("539–63 a. C.", "Exilio, retorno y nuevos imperios", "Dominio persa, retorno y reconstrucción del Templo; después, expansión helenística y crisis que enmarca 1–2 Macabeos."),
    new TimelineItem("c. 6 a. C.–100 d. C.", "Jesús y las primeras comunidades", "Jesús vive bajo dominio romano; luego surgen comunidades cristianas. La mayoría de los escritos del Nuevo Testamento se compone durante el siglo I; algunas dataciones se discuten en torno al cambio de siglo o a inicios del II.")
}));

app.MapGet("/api/sources", () => Results.Ok(new[]
{
    new SourceItem("Catecismo de la Iglesia Católica, 101–141", "https://www.vatican.va/archive/catechism_sp/p1s1c2a3_sp.html", "Inspiración, interpretación, géneros, canon y relación entre los Testamentos."),
    new SourceItem("Concilio Vaticano II, Dei Verbum", "https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651118_dei-verbum_sp.html", "Constitución sobre la revelación divina; en especial, núm. 12 sobre interpretación y géneros literarios."),
    new SourceItem("Pontificia Comisión Bíblica", "https://www.vatican.va/roman_curia/congregations/cfaith/pcb_doc_index.htm", "Incluye La interpretación de la Biblia en la Iglesia (1993) y El pueblo judío y sus Escrituras sagradas en la Biblia cristiana (2001)."),
    new SourceItem("USCCB: Biblia, introducciones y notas por libro", "https://bible.usccb.org/bible", "Índice de los 73 libros con introducciones y notas editoriales católicas, principalmente en inglés."),
    new SourceItem("Material de referencia: Mapas de la Palabra", "https://www.mapasdelapalabra.com/", "La página anuncia fichas de los 73 libros, panorama, cronología y diario espiritual; también usa la expresión «método APROBADO» sin identificar en esa página a la autoridad que lo habría aprobado. Son afirmaciones promocionales y no validan el contenido interno del descargable.")
}));

app.MapFallbackToFile("index.html");
app.Run();

record Book(string Slug, string Title, string Group, string Testament, string Summary, string Role, string Context, string Question, string SourceUrl);
record TimelineItem(string Period, string Title, string Description);
record SourceItem(string Title, string Url, string Description);


