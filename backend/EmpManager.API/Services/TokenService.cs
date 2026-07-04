// ═══════════════════════════════════════════════════════════════
// FILE: Services/TokenService.cs
// PURPOSE: Generates signed JWT access tokens for authenticated users.
//
// .NET / WEB API CONCEPTS:
// - JWT (Json Web Token) Token Generation
// - Dependency Injection using Constructor Injection
// - Options Pattern (IOptions<JwtSettings>) for configuration binding
// - Claims-based identity modeling using Claim and ClaimTypes
//
// ─────────────────────────────────────────────
// INTERVIEW QUESTIONS:
// ─────────────────────────────────────────────
// Q: Is the JWT payload encrypted? Can the user read it?
// A: NO — Base64Url encoding is NOT encryption. Anyone can decode the header
//    and payload. Never store sensitive data (passwords, credit cards) in a JWT.
//    Only put non-sensitive identifiers (user ID, role, username).
//    The SIGNATURE ensures the claims cannot be MODIFIED, but they can be READ.
//
// Q: What is the difference between HS256 and RS256?
// A: HS256 (HMAC-SHA256) — SYMMETRIC: same secret key to sign AND verify.
//                          Simple, fast. The API is the only one that signs AND verifies.
//    RS256 (RSA-SHA256)   — ASYMMETRIC: private key to sign, public key to verify.
//                          Any service can verify without knowing the private key.
//                          Better for microservices / third-party token consumers.
//    For a single API + single Angular app, HS256 is appropriate.
// ═══════════════════════════════════════════════════════════════

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using EmpManager.API.Models;

namespace EmpManager.API.Services;

public class TokenService : ITokenService
{
    private readonly JwtSettings _jwtSettings;

    public TokenService(IOptions<JwtSettings> jwtOptions)
    {
        _jwtSettings = jwtOptions.Value;
    }

    /// <summary>
    /// Generates a signed JWT token with user identity claims.
    /// Returns a tuple: (token string, expiry DateTime).
    /// </summary>
    public (string Token, DateTime ExpiresAt) GenerateToken(string username, string role)
    {
        var expiresAt = DateTime.UtcNow.AddHours(_jwtSettings.ExpiryHours);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, username),
            new(JwtRegisteredClaimNames.Name, username),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.Iat,
                DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                ClaimValueTypes.Integer64),
            new(ClaimTypes.Role, role),
        };

        var keyBytes   = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);
        var signingKey = new SymmetricSecurityKey(keyBytes);

        var signingCredentials = new SigningCredentials(
            signingKey,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer:             _jwtSettings.Issuer,
            audience:           _jwtSettings.Audience,
            claims:             claims,
            notBefore:          DateTime.UtcNow,
            expires:            expiresAt,
            signingCredentials: signingCredentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return (tokenString, expiresAt);
    }
}
