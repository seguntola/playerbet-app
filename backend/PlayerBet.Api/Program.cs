using Microsoft.EntityFrameworkCore;
using PlayerBet.Api.Data;
using PlayerBet.Api.Services;
using PlayerBet.Api.Middleware;
using PlayerBet.Api.Configuration;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://10.0.0.247:5001")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});


builder.Services.Configure<TheOddsApiConfiguration>(builder.Configuration.GetSection(TheOddsApiConfiguration.SectionName));

// Add Entity Framework
builder.Services.AddDbContext<PlayerBetDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(connectionString);
});

// Register services
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IBettingService, BettingService>();
builder.Services.AddScoped<IDataSyncService, DataSyncService>();
builder.Services.AddScoped<ICacheService, MemoryCacheService>();

builder.Services.AddMemoryCache();

// And update the HttpClient registration to:
builder.Services.AddHttpClient<ISportsDataService, SportsDataService>((sp, client) =>
{
    var cfg = sp.GetRequiredService<IOptionsMonitor<TheOddsApiConfiguration>>().CurrentValue;
    client.BaseAddress = new Uri(cfg.BaseUrl);
    client.Timeout = TimeSpan.FromSeconds(cfg.TimeoutSeconds);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Add error handling middleware
app.UseMiddleware<ErrorHandlingMiddleware>();

//app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

// Auto-migrate database on startup (for development)
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<PlayerBetDbContext>();
    try
    {
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

app.Run("http://0.0.0.0:5001");
