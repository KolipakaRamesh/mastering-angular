// ═══════════════════════════════════════════════════════════════
// FILE: Models/LoginRequest.cs
// PURPOSE: Defines the shape of the data the client sends to the login endpoint.
//
// .NET / WEB API CONCEPTS:
// - Request DTOs (Data Transfer Objects)
// - Model Validation using DataAnnotations attributes
//
// ─────────────────────────────────────────────
// INTERVIEW QUESTIONS:
// ─────────────────────────────────────────────
// Q: What is the difference between a DTO and a Domain Model?
// A: Domain Model represents your business entity with behavior. DTO represents data moving across a boundary (API layer). Using DTOs prevents exposing internal database fields and decouples the API contract from the database schema.
//
// Q: What does [Required] do in ASP.NET Core?
// A: It's a Data Annotation validation attribute. When `[ApiController]` is present on a controller, ASP.NET Core automatically validates all `[Required]` fields before executing the endpoint, returning 400 Bad Request if validation fails.
// ═══════════════════════════════════════════════════════════════

using System.ComponentModel.DataAnnotations;

namespace EmpManager.API.Models;

/// <summary>
/// The request body sent by the client when logging in.
/// Maps to the JSON body: { "username": "admin", "password": "admin123" }
/// </summary>
public class LoginRequest
{
    // [Required] = validation attribute
    // If this field is missing or null/empty in the request body,
    // ASP.NET Core returns 400 Bad Request AUTOMATICALLY (because of [ApiController])
    [Required(ErrorMessage = "Username is required")]
    public string Username { get; set; } = string.Empty;

    // string.Empty is the default to avoid C# nullable warnings
    // In a real app you'd also add: [MinLength(3)], [MaxLength(100)]
    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = string.Empty;
}
