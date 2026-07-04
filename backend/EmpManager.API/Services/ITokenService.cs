// ═══════════════════════════════════════════════════════════════
// FILE: Services/ITokenService.cs
// PURPOSE: Interface (contract) for JWT token generation.
//
// .NET / WEB API CONCEPTS:
// - Dependency Inversion Principle (the D in SOLID)
// - Dependency Injection Lifecycles (Transient, Scoped, Singleton)
// - Abstract interfaces vs concrete classes
//
// ─────────────────────────────────────────────
// INTERVIEW QUESTIONS:
// ─────────────────────────────────────────────
// Q: What is the difference between AddSingleton, AddScoped, and AddTransient?
// A: AddSingleton  → ONE instance for the entire app lifetime (shared by all requests)
//    AddScoped     → ONE instance per HTTP REQUEST (created fresh per request)
//    AddTransient  → NEW instance every time it's injected (even in the same request)
//
//    TokenService reads config (stable) and creates JWT strings (stateless).
//    Both Singleton and Scoped work here. We use Scoped as a safe default for services.
//
// Q: What happens if you inject a Scoped service into a Singleton service?
// A: CAPTIVE DEPENDENCY problem — the Scoped service gets "captured" and lives
//    forever inside the Singleton, bypassing the per-request lifecycle.
//    ASP.NET Core detects this at startup and throws an InvalidOperationException
//    in Development mode (scope validation is enabled by default in dev).
// ═══════════════════════════════════════════════════════════════

using EmpManager.API.Models;

namespace EmpManager.API.Services;

public interface ITokenService
{
    /// <summary>
    /// Generates a signed JWT access token for the given user information.
    /// </summary>
    /// <param name="username">The authenticated user's username.</param>
    /// <param name="role">The user's role (e.g., "Admin", "User").</param>
    /// <returns>A signed JWT string and its expiry time.</returns>
    (string Token, DateTime ExpiresAt) GenerateToken(string username, string role);
}
