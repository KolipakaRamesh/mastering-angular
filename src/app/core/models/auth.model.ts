/**
 * FILE: core/models/auth.model.ts
 * PURPOSE: Type-safe interfaces matching the backend DTO shapes.
 *
 * ANGULAR / TYPESCRIPT CONCEPT: Interfaces
 * ═══════════════════════════════════════════════════════════════
 * Interfaces exist purely compile-time to provide design-time checking
 * and editor autocomplete. They are completely erased from the compiled
 * JavaScript, generating zero runtime overhead.
 *
 * Why align them exactly with the C# DTOs?
 * To avoid runtime errors caused by mismatched keys (e.g., trying to read
 * response.jwt instead of response.token).
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
  expiresAt: string; // ISO 8601 string representation of DateTime
}
