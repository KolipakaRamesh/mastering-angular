// ═══════════════════════════════════════════════════════════════
// FILE: Models/AdminUserSettings.cs
// PURPOSE: Strongly-typed settings for the hardcoded admin user.
//
// .NET / WEB API CONCEPTS:
// - Strongly-typed application settings mapping (Configuration Binding)
// - Layered configuration settings (appsettings.json vs Env variables)
//
// ─────────────────────────────────────────────
// INTERVIEW QUESTIONS:
// ─────────────────────────────────────────────
// Q: How are nested configuration keys (like "AdminUser:Username") mapped to Environment Variables in production?
// A: Hierarchical keys are separated by double underscores `__` in environment variables. So "AdminUser:Username" becomes "AdminUser__Username" at runtime.
// ═══════════════════════════════════════════════════════════════

namespace EmpManager.API.Models;

public class AdminUserSettings
{
    // The section name in appsettings.json must match exactly:
    // "AdminUser": { "Username": "...", "Password": "...", "Role": "..." }
    public const string SectionName = "AdminUser";

    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role     { get; set; } = string.Empty;
}
