/**
 * Sanitize file/directory names for safe filesystem operations.
 * Prevents path traversal attacks and allows only safe characters.
 */
export function sanitizeFileName(input: string): string {
  let sanitized = input.normalize("NFC");
  sanitized = sanitized.trim();

  if (sanitized.length === 0) {
    throw new Error("File name is empty");
  }

  // Prevent path traversal attacks
  if (
    sanitized.includes("..") ||
    sanitized.startsWith("/") ||
    sanitized.startsWith("\\") ||
    /^[a-zA-Z]:/.test(sanitized)
  ) {
    throw new Error("Invalid path detected");
  }

  // Remove dangerous characters (Windows reserved + control characters)
  // biome-ignore lint/suspicious/noControlCharactersInRegex: intentionally matching control characters for sanitization
  sanitized = sanitized.replace(/[<>:"/\\|?*\x00-\x1F]/g, "");

  // Remove directory separators
  sanitized = sanitized.replace(/[/\\]/g, "");

  // Remove leading/trailing dots and spaces (Windows requirement)
  sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, "");

  // Enforce 255-byte limit (common filesystem limit)
  const maxLength = 255;
  if (new Blob([sanitized]).size > maxLength) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const bytes = encoder.encode(sanitized);
    sanitized = decoder.decode(bytes.slice(0, maxLength));
  }

  if (sanitized.length === 0) {
    throw new Error("File name is empty after sanitization");
  }

  return sanitized;
}

/**
 * Sanitize a full file path by sanitizing each segment individually.
 */
export function sanitizePath(path: string): string {
  const segments = path.split("/").filter((s) => s.length > 0);

  const sanitizedSegments = segments.map((segment) => {
    try {
      return sanitizeFileName(segment);
    } catch {
      throw new Error(`Invalid path segment: "${segment}"`);
    }
  });

  return sanitizedSegments.join("/");
}
