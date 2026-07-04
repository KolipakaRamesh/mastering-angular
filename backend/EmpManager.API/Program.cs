// ═══════════════════════════════════════════════════════════════
// FILE: Program.cs
// PURPOSE: Application entry point — registers services and configures middleware.
//
// .NET / WEB API CONCEPTS:
// - ASP.NET Core Middleware Pipeline and execution order
// - Service Registration (CORS, JWT Bearer Authentication, Dependency Injection)
//
// ─────────────────────────────────────────────
// INTERVIEW QUESTIONS:
// ─────────────────────────────────────────────
// Q: Why must UseAuthentication() come before UseAuthorization()?
// A: UseAuthentication() reads the JWT token and populates HttpContext.User (the identity of the caller). UseAuthorization() then checks that identity against [Authorize] rules. If you reverse them, HttpContext.User is empty when authorization runs — every [Authorize] request fails with 401.
//
// Q: Why must UseCors() come before UseAuthentication()?
// A: Browser sends a CORS preflight OPTIONS request before every cross-origin request. If CORS middleware hasn't run, the preflight is rejected with no Access-Control-Allow-Origin header. The browser then blocks the actual request entirely — even before authentication runs.
// ═══════════════════════════════════════════════════════════════

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using EmpManager.API.Models;
using EmpManager.API.Services;

// ── PHASE 1: BUILDER — Register Services ──────────────────────
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// ── STEP A: Bind JWT settings from appsettings.json ───────────
// GetSection("Jwt") reads the "Jwt" block from appsettings.json.
// .Get<JwtSettings>() deserializes it into our typed class.
// We null-check because if the section is missing, the app should
// fail loudly at startup — not silently with a NullReferenceException later.
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtSettings = jwtSection.Get<JwtSettings>()
    ?? throw new InvalidOperationException(
        "JWT settings are missing from appsettings.json. " +
        "Ensure the 'Jwt' section exists with SecretKey, Issuer, Audience.");

// Register JwtSettings in the DI container.
// IOptions<JwtSettings> is injected into TokenService.
builder.Services.Configure<JwtSettings>(jwtSection);

// ── STEP B2: Bind AdminUser settings from config ───────────────
// This reads from the environment-specific appsettings file:
//   Development → appsettings.Development.json (admin / admin123)
//   Production  → Environment variables (AdminUser__Username, AdminUser__Password)
//
// STARTUP VALIDATION: Fail fast if credentials are missing.
// It's better to crash at startup with a clear error than to fail silently on login.
var adminSection = builder.Configuration.GetSection(AdminUserSettings.SectionName);
var adminSettings = adminSection.Get<AdminUserSettings>();

if (string.IsNullOrWhiteSpace(adminSettings?.Username) ||
    string.IsNullOrWhiteSpace(adminSettings?.Password))
{
    throw new InvalidOperationException(
        "AdminUser settings are missing. " +
        "Set 'AdminUser:Username' and 'AdminUser:Password' " +
        "in appsettings.Development.json or via environment variables " +
        "AdminUser__Username and AdminUser__Password.");
}

builder.Services.Configure<AdminUserSettings>(adminSection);

// ── STEP B3: Register TokenService ────────────────────────────
// AddScoped → new instance per HTTP request.
// We register the INTERFACE → IMPLEMENTATION so controllers depend
// on the abstraction (ITokenService), not the concrete class.
builder.Services.AddScoped<ITokenService, TokenService>();

// ── STEP B: Configure JWT Authentication ──────────────────────
//
// AddAuthentication() registers the authentication system.
// JwtBearerDefaults.AuthenticationScheme = "Bearer"
// This tells ASP.NET: "When a request arrives, look for a 'Bearer' token
// in the Authorization header and validate it as a JWT."
//
// AUTHENTICATION SCHEME:
// A "scheme" is a named authentication mechanism. You can have multiple
// (Cookies, Bearer, ApiKey) and specify which one [Authorize] uses.
// JwtBearerDefaults.AuthenticationScheme = "Bearer" is the standard for REST APIs.
builder.Services
    .AddAuthentication(options =>
    {
        // DefaultAuthenticateScheme: Which scheme to use when no scheme is specified
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;

        // DefaultChallengeScheme: Which scheme to use when unauthenticated
        // (what runs when [Authorize] fails — returns 401 for APIs)
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        // ── TOKEN VALIDATION PARAMETERS ────────────────────────
        // This is the CORE of JWT security — these rules are checked
        // on EVERY incoming request that has a Bearer token.

        options.TokenValidationParameters = new TokenValidationParameters
        {
            // VALIDATE ISSUER: Check that token's "iss" claim matches our API name.
            // Prevents tokens issued by other APIs from being used here.
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,               // must match what we put in the token

            // VALIDATE AUDIENCE: Check that token's "aud" claim matches our app name.
            // Prevents tokens intended for one audience being used by another.
            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,            // must match what we put in the token

            // VALIDATE LIFETIME: Reject tokens where DateTime.UtcNow > exp claim.
            // Without this, expired tokens would still be accepted!
            ValidateLifetime = true,

            // CLOCK SKEW: How much time difference between server clocks is tolerated.
            // Default is 5 minutes — we set it to 0 for strict expiry.
            // In distributed systems, a small skew is acceptable.
            ClockSkew = TimeSpan.Zero,

            // VALIDATE SIGNING KEY: The most critical check.
            // Re-computes HMACSHA256(header.payload, secretKey) and
            // compares it to the signature in the token.
            // If anyone tampered with the payload, this will NOT match → 401.
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                // The secret key must be converted to bytes.
                // The SAME key used here MUST be used in Step 4 to SIGN the token.
                // ASYMMETRIC alternative: Use RSA keys (public key to verify, private key to sign)
                // — more secure for distributed systems but more complex.
                Encoding.UTF8.GetBytes(jwtSettings.SecretKey)
            ),

            // NAME CLAIM TYPE: Which JWT claim maps to User.Identity.Name
            // Default is a long .NET URL — we map it to the standard JWT "name" claim
            // so User.Identity.Name returns "admin" instead of null/Unknown.
            NameClaimType = System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Name,

            // ROLE CLAIM TYPE: Which JWT claim maps to User roles.
            // Required for [Authorize(Roles = "Admin")] to evaluate correctly.
            RoleClaimType = System.Security.Claims.ClaimTypes.Role
        };

        // ── EVENTS (optional but useful for debugging) ─────────
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                // This fires when token validation FAILS.
                // Useful for logging — in production, don't expose details to clients.
                Console.WriteLine($"JWT Auth failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                // This fires when token validation SUCCEEDS.
                // HttpContext.User is now populated with claims from the token.
                var username = context.Principal?.Identity?.Name;
                Console.WriteLine($"JWT Auth succeeded for: {username}");
                return Task.CompletedTask;
            }
        };
    });

// ── STEP C: Configure CORS Policy ─────────────────────────────
//
// CORS (Cross-Origin Resource Sharing):
// By default, browsers BLOCK JavaScript from making HTTP requests to a
// DIFFERENT origin (different domain, port, or protocol) than the page.
//
// Your Angular app runs on: http://localhost:4200
// Your API runs on:         http://localhost:5225
// These are DIFFERENT ORIGINS (different port) → browser blocks the request.
//
// The CORS policy tells the API to add HTTP response headers that tell
// the browser: "it's OK for code from localhost:4200 to access me."
//
// WHAT CORS IS NOT: CORS is enforced by the BROWSER, not the server.
// It does NOT prevent server-to-server calls (Postman, curl ignore CORS).
// CORS is purely a browser security feature.
//
// INTERVIEW QUESTION:
// Q: What is a CORS preflight request?
// A: Before sending a cross-origin POST/PUT/DELETE (or any request with custom headers),
//    the browser automatically sends an OPTIONS request first — the "preflight."
//    It asks: "API, will you accept a POST from localhost:4200 with an Authorization header?"
//    If the API responds with the right Access-Control-Allow-* headers, the browser
//    sends the actual request. If not, it blocks it entirely.
var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins")
    .Get<string[]>() ?? ["http://localhost:4200"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDevPolicy", policy =>
    {
        policy
            // WithOrigins: Whitelist specific origins (Angular dev server)
            // In production: replace with your actual domain
            .WithOrigins(allowedOrigins)

            // AllowAnyHeader: Allows Authorization header, Content-Type, etc.
            .AllowAnyHeader()

            // AllowAnyMethod: Allows GET, POST, PUT, DELETE, OPTIONS (preflight)
            .AllowAnyMethod()

            // AllowCredentials: Required if Angular sends cookies or auth headers
            // NOTE: Cannot be combined with WithOrigins("*") — must use specific origins
            .AllowCredentials();
    });
});

// ── PHASE 2: APP — Configure Middleware Pipeline ───────────────
var app = builder.Build();

// ── MIDDLEWARE ORDER (position matters!) ──────────────────────

// 1. CORS — must be first (handles OPTIONS preflight before any auth check)
app.UseCors("AngularDevPolicy");

// Serve Angular frontend static files
app.UseDefaultFiles();
app.UseStaticFiles();

// 2. HTTPS Redirect — redirect HTTP to HTTPS
//    We comment this out for local development simplicity.
//    In production, ALWAYS enable HTTPS.
// app.UseHttpsRedirection();

// 3. AUTHENTICATION — reads JWT from Authorization header, sets HttpContext.User
//    MUST come before UseAuthorization()
app.UseAuthentication();

// 4. AUTHORIZATION — checks [Authorize] attributes using the established identity
//    MUST come after UseAuthentication()
app.UseAuthorization();

// 5. CONTROLLERS — routes request to the matching controller action
app.MapControllers();

// Fallback all other routes to index.html (Angular HTML5 routing)
app.MapFallbackToFile("index.html");

app.Run();