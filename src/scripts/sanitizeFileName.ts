/**
 * ファイル名・ディレクトリ名を安全にサニタイズする
 * パストラバーサル攻撃を防ぎ、安全な文字のみを許可
 */
export function sanitizeFileName(input: string): string {
  // Unicode正規化(NFCに統一)
  let sanitized = input.normalize("NFC");

  // トリム
  sanitized = sanitized.trim();

  // 空文字列チェック
  if (sanitized.length === 0) {
    throw new Error("ファイル名が空です");
  }

  // パストラバーサル攻撃を防ぐ
  // - 絶対パス(/, \, C:など)を拒否
  // - 相対パス(.., .)を拒否
  if (
    sanitized.includes("..") ||
    sanitized.startsWith("/") ||
    sanitized.startsWith("\\") ||
    /^[a-zA-Z]:/.test(sanitized) // Windowsドライブレター
  ) {
    throw new Error("不正なパスが含まれています");
  }

  // 危険な文字を削除
  // Windows: < > : " / \ | ? *
  // 制御文字: \x00-\x1F
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[<>:"/\\|?*\x00-\x1F]/g, "");

  // ディレクトリセパレータを完全に削除
  sanitized = sanitized.replace(/[/\\]/g, "");

  // 先頭・末尾のドットとスペースを削除(Windowsの仕様)
  sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, "");

  // 長さ制限(255バイト - ほとんどのファイルシステムの上限)
  const maxLength = 255;
  if (new Blob([sanitized]).size > maxLength) {
    // バイト数で切り詰め
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const bytes = encoder.encode(sanitized);
    sanitized = decoder.decode(bytes.slice(0, maxLength));
  }

  // 再度空文字列チェック
  if (sanitized.length === 0) {
    throw new Error("サニタイズ後にファイル名が空になりました");
  }

  return sanitized;
}

/**
 * ファイルパス全体をサニタイズする
 * 各セグメントを個別にサニタイズ
 */
export function sanitizePath(path: string): string {
  const segments = path.split("/").filter((s) => s.length > 0);

  const sanitizedSegments = segments.map((segment) => {
    try {
      return sanitizeFileName(segment);
    } catch {
      throw new Error(`パスセグメント "${segment}" が不正です`);
    }
  });

  return sanitizedSegments.join("/");
}
