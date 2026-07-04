// ═══════════════════════════════════════════════════════════════
// FILE: Models/LoginResponse.cs
// PURPOSE: Defines the shape of the data the server sends back after login.
//
// .NET / WEB API CONCEPTS:
// - Response DTOs (Data Transfer Objects) for APIs
// - Lifetime management of tokens
//
// ─────────────────────────────────────────────
// INTERVIEW QUESTIONS:
// ─────────────────────────────────────────────
// Q: Why return an expiry time from the server instead of calculating it on the client?
// A: The server controls the token's actual lifetime. Returning expiresAt lets the
//    Angular app proactively check if a token is expired and redirect to login
//    BEFORE making an API call (avoids a wasted round-trip and a 401 error).
// ═══════════════════════════════════════════════════════════════

namespace EmpManager.API.Models;

/// <summary>
/// The response body sent back to the client after successful authentication.
/// </summary>
public class LoginResponse
{
    // The JWT token string — Angular stores this and sends it with every request.
    // In Step 4 this will be a real JWT. For now it's a placeholder.
    public string Token { get; set; } = string.Empty;

    // We return the username so Angular can display "Welcome, admin" in the header
    // WITHOUT having to decode the JWT token on the client side.
    public string Username { get; set; } = string.Empty;

    // The role(s) the user has — Angular uses this for UI-level decisions
    // e.g., "only show Delete button if role is Admin"
    // NOTE: Role-based SECURITY must always be enforced on the SERVER too.
    public string Role { get; set; } = string.Empty;

    // When the token expires — Angular uses this for proactive token refresh
    public DateTime ExpiresAt { get; set; }
}
