import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { 
  mockCategories, 
  mockMenuItems, 
  mockReviews, 
  mockBlogPosts, 
  mockEmployees, 
  mockAvailability 
} from "./mockData";

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
  // Pure front-end: mock API requests
  console.log(`Mocking ${method} request to ${url}`, data);
  
  // Return a fake successful response
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;

    // Pure front-end: return mock data based on URL
    if (url.startsWith("/api/menu/categories")) {
      return mockCategories as any;
    }
    if (url.startsWith("/api/menu/items") || url.startsWith("/api/menu/featured")) {
      if (url.includes("category=")) {
        const categoryId = new URLSearchParams(url.split("?")[1]).get("category");
        return mockMenuItems.filter(item => item.categoryId === categoryId) as any;
      }
      if (url.startsWith("/api/menu/featured")) {
        return mockMenuItems.filter(item => item.isFeatured) as any;
      }
      return mockMenuItems as any;
    }
    if (url.startsWith("/api/reviews")) {
      return mockReviews as any;
    }
    if (url.startsWith("/api/blog")) {
      if (url.includes("recent")) {
        return mockBlogPosts.slice(0, 3) as any;
      }
      const parts = url.split("/");
      const id = parseInt(parts[parts.length - 1]);
      if (!isNaN(id)) {
        return mockBlogPosts.find(p => p.id === id) as any;
      }
      return mockBlogPosts as any;
    }
    if (url.startsWith("/api/employees")) {
      return mockEmployees as any;
    }
    if (url.startsWith("/api/table-availability")) {
      return mockAvailability as any;
    }
    if (url.startsWith("/api/cart")) {
      return [] as any;
    }

    const res = await fetch(url, {
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
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
