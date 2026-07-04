// ═══════════════════════════════════════════════════════════════
// FILE: Controllers/AuthenticationController.cs
// PURPOSE: Handles authentication HTTP endpoints.
//
// .NET / WEB API CONCEPTS:
// - ASP.NET Core API Controllers and Route mapping
// - Dependency Injection inside Controller constructors
// - Environment configuration options mapping (IOptions)
//
// ─────────────────────────────────────────────
// INTERVIEW QUESTIONS:
// ─────────────────────────────────────────────
// Q: Why do we return a generic error message like "Invalid username or password" for both username and password mismatches?
// A: To prevent username enumeration attacks. If you tell the client specifically "User does not exist" or "Incorrect password", an attacker can scan your system to discover valid usernames.
//
// Q: What is the purpose of [ApiController] and [Route] attributes in ASP.NET Core?
// A: [ApiController] automatically enables features like automatic model validation (returning 400 Bad Request if validation rules fail), HTTP parameter binding source inference (like [FromBody]), and unified error format. [Route] defines the URI template for routing requests to the controller.
//
// Q: What is the difference between Authentication and Authorization?
// A: Authentication = "Who are you?" (identity verification — UseAuthentication)
//    Authorization  = "What are you allowed to do?" (permission check — [Authorize])
//    You must be authenticated before you can be authorized.
// ═══════════════════════════════════════════════════════════════

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using EmpManager.API.Models;
using EmpManager.API.Services;

namespace EmpManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthenticationController : ControllerBase
{
    private readonly ILogger<AuthenticationController> _logger;
    private readonly AdminUserSettings _adminUser;
    private readonly ITokenService _tokenService;

    public AuthenticationController(
        ILogger<AuthenticationController> logger,
        IOptions<AdminUserSettings> adminUserOptions,
        ITokenService tokenService)
    {
        _logger      = logger;
        _adminUser   = adminUserOptions.Value; // Unwrap options
        _tokenService = tokenService;
    }

    // POST /api/authentication/login
    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    public ActionResult<LoginResponse> Login([FromBody] LoginRequest request)
    {
        _logger.LogInformation("Login attempt for user: {Username}", request.Username);

        // Validate credentials case-insensitively for username, case-sensitively for password
        var isValidUser = string.Equals(
            request.Username,
            _adminUser.Username,
            StringComparison.OrdinalIgnoreCase);

        var isValidPassword = request.Password == _adminUser.Password;

        if (!isValidUser || !isValidPassword)
        {
            _logger.LogWarning("Failed login attempt for user: {Username}", request.Username);
            return Unauthorized(new ErrorResponse { Message = "Invalid username or password." });
        }

        // Generate JWT token
        var (token, expiresAt) = _tokenService.GenerateToken(
            _adminUser.Username,
            _adminUser.Role
        );

        var response = new LoginResponse
        {
            Token     = token,
            Username  = _adminUser.Username,
            Role      = _adminUser.Role,
            ExpiresAt = expiresAt
        };

        _logger.LogInformation("Successful login for user: {Username}", request.Username);
        return Ok(response);
    }

    // GET /api/authentication/health
    [HttpGet("health")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Health()
    {
        return Ok(new { Status = "API is running", Timestamp = DateTime.UtcNow });
    }

    // GET /api/authentication/me (requires authentication)
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public IActionResult Me()
    {
        var username = User.Identity?.Name ?? "Unknown";
        var claims   = User.Claims.Select(c => new { c.Type, c.Value });

        return Ok(new
        {
            Message  = $"Hello, {username}! You are authenticated.",
            Username = username,
            Claims   = claims
        });
    }
}
