import { AuthProvider } from "@refinedev/core";
import { cookies } from "next/headers";
import { supabaseClient, supabaseAdmin } from "@utility/supabase-client";

type CustomAuthBindings = AuthProvider & {
    createUser?: (params?: any) => Promise<any>;
};
export const authProviderServer: Pick<CustomAuthBindings, "check"> = {
    //   check: async () => {
    //     const cookieStore = cookies();
    //     const auth = cookieStore.get("token");

    //     if (auth) {
    //       return {
    //         authenticated: true,
    //       };
    //     }

    //     return {
    //       authenticated: false,
    //       logout: true,
    //       redirectTo: "/login",
    //     };
    //   },

    check: async () => {
        const cookieStore = cookies();
        const token: any = cookieStore.get("token");
        const { data } = await supabaseClient.auth.getUser(token?.value);
        const { user } = data;

        if (user) {
            return {
                authenticated: true,
            };
        }

        return {
            authenticated: false,
            logout: true,
            redirectTo: "/login",
        };
    },
};

