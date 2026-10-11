/**
 * Robust API Client for authentication and configuration.
 * - Uses relative paths (e.g. /api/admin/login or /api/login).
 * - Prevents JSON parsing crashes when server or Vercel returns HTML error pages.
 * - Provides informative error messages.
 */

interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T;
  message?: string;
}

export async function safeFetchJson<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Ensure relative path starting with /
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (options.body && typeof options.body === 'string') {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const res = await fetch(url, mergedOptions);
    const contentType = res.headers.get('content-type') || '';

    // Check if response is real JSON
    if (contentType.includes('application/json')) {
      const json = await res.json();
      return {
        ok: res.ok,
        status: res.status,
        data: json,
        message: json?.message,
      };
    }

    // Response is NOT JSON (likely HTML 404 / 500 from Vercel or misconfigured router)
    const text = await res.text();
    let friendlyMessage = 'Phản hồi từ máy chủ không phải là JSON hợp lệ.';

    if (text.includes('The page') || text.includes('404') || res.status === 404) {
      friendlyMessage = `Đường dẫn API '${url}' không tìm thấy trên máy chủ (404). Vui lòng kiểm tra cấu hình Vercel Serverless.`;
    } else if (res.status >= 500) {
      friendlyMessage = `Lỗi máy chủ (${res.status}). Vui lòng thử lại sau.`;
    }

    return {
      ok: false,
      status: res.status,
      data: null as any,
      message: friendlyMessage,
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      status: 0,
      data: null as any,
      message: `Không thể kết nối đến máy chủ: ${errMsg}`,
    };
  }
}
