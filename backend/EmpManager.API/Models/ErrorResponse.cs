// ═══════════════════════════════════════════════════════════════
// FILE: Models/ErrorResponse.cs
// PURPOSE: A consistent error shape returned for ALL API errors.
//
// .NET / WEB API CONCEPTS:
// - Consistent Error Contract
// - RFC 7807 (Problem Details) pattern for REST API errors
//
// ─────────────────────────────────────────────
// INTERVIEW QUESTIONS:
// ─────────────────────────────────────────────
// Q: Why is returning a consistent error format like RFC 7807 (Problem Details) important for APIs?
// A: A consistent error format allows client applications (e.g., Angular or Mobile apps) to write a single, centralized error interceptor/handler to parse messages, display user notifications, and handle status-code-specific actions instead of writing ad-hoc error handling per endpoint.
// ═══════════════════════════════════════════════════════════════

namespace EmpManager.API.Models;

public class ErrorResponse
{
    public string Message { get; set; } = string.Empty;
}
