import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Ensure the query key starts with a slash for absolute URLs
    const url = queryKey.join("/");
    const fullUrl = url.startsWith("/") ? url : `/${url}`;
    
    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes - forms don't change often
      gcTime: 10 * 60 * 1000, // 10 minutes - keep in memory longer
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        // Retry up to 2 times for server errors
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry mutations on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        // Retry up to 1 time for server errors
        return failureCount < 1;
      },
      retryDelay: 1000,
    },
  },
});

// Prefetch common queries for better UX
export const prefetchCommonQueries = async () => {
  // Prefetch petition forms since they're used on the main page
  await queryClient.prefetchQuery({
    queryKey: ["/api/petition-forms"],
    queryFn: async () => {
      const response = await fetch("/api/petition-forms");
      if (!response.ok) {
        throw new Error("Failed to fetch forms");
      }
      return response.json();
    },
  });
};

// Utility function for optimistic updates
export const optimisticUpdate = <T>(
  queryKey: string[],
  updater: (oldData: T | undefined) => T
) => {
  queryClient.setQueryData(queryKey, updater);
};

// Utility function for rollback on error
export const rollbackOptimisticUpdate = <T>(
  queryKey: string[],
  previousData: T | undefined
) => {
  queryClient.setQueryData(queryKey, previousData);
};
