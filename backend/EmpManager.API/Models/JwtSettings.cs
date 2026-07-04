// ═══════════════════════════════════════════════════════════════
// FILE: Models/JwtSettings.cs
// PURPOSE: A strongly-typed class that maps to the "Jwt" section in appsettings.json.
//
// .NET / WEB API CONCEPTS:
// - Options Pattern (strongly-typed configurations)
// - Binding configuration sections (GetSection)
//
// ─────────────────────────────────────────────
// INTERVIEW QUESTIONS:
// ─────────────────────────────────────────────
// Q: What is the difference between IOptions<T>, IOptionsSnapshot<T>, and IOptionsMonitor<T>?
// A: IOptions<T> is a singleton registered service (reads config once at startup). IOptionsSnapshot<T> is scoped (re-reads configuration per request). IOptionsMonitor<T> is a singleton that registers a change notification callback to update config dynamically.
//
// Q: How do you handle token expiry without forcing users to log in every hour?
// A: Use Refresh Tokens — a long-lived token stored in a secure HttpOnly cookie that can silently request a new access token when it expires.
// ═══════════════════════════════════════════════════════════════

namespace EmpManager.API.Models;

public class JwtSettings
{
    // ── WHAT IS THE SECRET KEY? ────────────────────────────────
    // The secret key is the PRIVATE signing key used to create the JWT signature.
    // HMAC-SHA256 algorithm: SIGNATURE = HMACSHA256(base64(header) + "." + base64(payload), SecretKey)
    //
    // SECURITY RULES:
    // ❌ NEVER hardcode it in source code
    // ❌ NEVER commit it to Git (even in appsettings.json — we'll use a placeholder)
    // ✅ In production: use Environment Variables, Azure Key Vault, or AWS Secrets Manager
    // ✅ In development: use `dotnet user-secrets`
    //
    // MINIMUM LENGTH: 256 bits (32 characters for HS256)
    // We use 64 characters for extra security margin.
    public string SecretKey { get; set; } = string.Empty;

    // ── WHAT IS THE ISSUER? ──────────────────────────────────────
    // The "iss" (issuer) claim identifies WHO created the token.
    // When the API validates an incoming token, it checks that "iss" matches
    // what it expects — preventing tokens from other systems being used here.
    // Typically: your API's domain name or application name.
    public string Issuer { get; set; } = string.Empty;

    // ── WHAT IS THE AUDIENCE? ────────────────────────────────────
    // The "aud" (audience) claim identifies WHO the token is INTENDED FOR.
    // Prevents a token issued for "mobile-app" from being used on "web-app".
    // Typically: your Angular app's name or domain.
    public string Audience { get; set; } = string.Empty;

    // ── EXPIRY ───────────────────────────────────────────────────
    // How many hours the token is valid.
    // Short-lived tokens (1 hour) are more secure.
    // After expiry, the user must log in again (or use a refresh token).
    //
    // INTERVIEW QUESTION:
    // Q: How do you handle token expiry without forcing users to log in every hour?
    // A: Use REFRESH TOKENS — a long-lived token (7-30 days) that can silently
    //    obtain a new short-lived access token. The refresh token is stored in an
    //    HTTP-only cookie. This is an advanced pattern we won't implement here but
    //    it's a common enterprise requirement.
    public int ExpiryHours { get; set; } = 1;
}
