/**
 * Universal Client API Fetcher with Automatic Silent Refresh
 * Seamlessly refreshes expired Access Tokens using the Refresh Token cookie when receiving 401.
 */

let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

function subscribeTokenRefresh(cb: (success: boolean) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(success: boolean) {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const initialResponse = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  // If request succeeds or fails for non-auth reasons, return immediately
  if (initialResponse.status !== 401 || url.includes('/api/auth/refresh') || url.includes('/api/auth/login')) {
    return initialResponse;
  }

  // Handle 401 Unauthorized: Attempt token refresh
  if (!isRefreshing) {
    isRefreshing = true;

    try {
      const refreshRes = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshRes.ok) {
        isRefreshing = false;
        onRefreshed(true);
        // Retry original request
        return await fetch(url, {
          ...options,
          credentials: 'include',
        });
      } else {
        isRefreshing = false;
        onRefreshed(false);
        return initialResponse;
      }
    } catch (err) {
      isRefreshing = false;
      onRefreshed(false);
      return initialResponse;
    }
  }

  // If a refresh is already in progress, wait for it
  return new Promise((resolve) => {
    subscribeTokenRefresh(async (success) => {
      if (success) {
        const retryRes = await fetch(url, {
          ...options,
          credentials: 'include',
        });
        resolve(retryRes);
      } else {
        resolve(initialResponse);
      }
    });
  });
}
