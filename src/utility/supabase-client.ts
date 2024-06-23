import { createClient } from "@refinedev/supabase";
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import Cookies from 'js-cookie';
// import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Listen for changes in authentication state for supabaseClient
supabaseClient.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
            Cookies.set("token", session.access_token, {
                expires: 30, // 30 days
                path: "/",
            });
        }
    } else if (event === 'SIGNED_OUT') {
        Cookies.remove("token", { path: "/" });
    }
});


//   export async function createSupbaseServerClientReadOnly() {
//     const cookieStore = cookies();

//     return createServerClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//       {
//         cookies: {
//           get(name: string) {
//             return cookieStore.get(name)?.value;
//           },
//         },
//       }
//     );
//   }
