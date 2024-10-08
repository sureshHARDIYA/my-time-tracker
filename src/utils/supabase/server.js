import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL and Anon Key must be provided in environment variables."
    );
  }

  // Create a server's Supabase client with newly configured cookies,
  // which could be used to maintain user's session
  return createServerSupabaseClient({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
    cookieOptions: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch (error) {
          console.error("Error setting cookies:", error);
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
