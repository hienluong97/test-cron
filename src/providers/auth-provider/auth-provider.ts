"use client";
import {
    supabaseAdmin
} from "@utility/supabase-client";
import { AuthBindings, AuthProvider } from "@refinedev/core";
import { supabaseClient } from "@utility/supabase-client";
import Cookies from "js-cookie";

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return {
                success: false,
                error,
            };
        }

        if (data?.session) {
            Cookies.set("token", data.session.access_token, {
                expires: 30, // 30 days
                path: "/",
            });

            return {
                success: true,
                redirectTo: "/",
            };
        }

        // for third-party login
        return {
            success: false,
            error: {
                name: "LoginError",
                message: "Invalid username or password",
            },
        };
    },
    logout: async () => {
        Cookies.remove("token", { path: "/" });
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            return {
                success: false,
                error,
            };
        }

        return {
            success: true,
            redirectTo: "/login",
        };
    },
    register: async ({ email, password }) => {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
            });

            if (error) {
                return {
                    success: false,
                    error,
                };
            }
            if (data) {
                const { error } = await supabaseClient
                    .from("users")
                    .insert({ id: data.user?.id, email: data.user?.email });

                return {
                    success: true,
                    successNotification: {
                        message: "Gui mail confirm thanh cong, vui long check mail",
                    },
                    redirectTo: "/",
                };
            }
        } catch (error: any) {
            return {
                success: false,
                error,
            };
        }

        return {
            success: false,
            error: {
                message: "Register failed",
                name: "Invalid email or password",
            },
        };
    },
    //   check: async () => {
    //     const token = Cookies.get("token");
    //     const { data } = await supabaseClient.auth.getUser(token);
    //     const { user } = data;

    //     console.log('check client ')

    //     if (user) {
    //       return {
    //         authenticated: true,
    //       };
    //     }

    //     return {
    //       authenticated: false,
    //       redirectTo: "/login",
    //     };
    //   },

    //  On the client, you can instead use getSession().session.user for faster results. 
    check: async () => {
        try {
            const { data } = await supabaseClient.auth.getSession();
            const { session } = data;

            if (!session) {
                return {
                    authenticated: false,
                    error: {
                        message: "Check failed",
                        name: "Session not found",
                    },
                    logout: true,
                    redirectTo: "/login",
                };
            }
        } catch (error: any) {
            return {
                authenticated: false,
                error: error || {
                    message: "Check failed",
                    name: "Session not found",
                },
                logout: true,
                redirectTo: "/login",
            };
        }

        return {
            authenticated: true,
        };
    },

    getPermissions: async () => {
        const user = await supabaseClient.auth.getUser();

        if (user) {
            return user.data.user?.role;
        }

        return null;
    },
    getIdentity: async () => {
        const { data } = await supabaseClient.auth.getUser();

        if (data?.user) {
            return {
                ...data.user,
                name: data.user.email,
            };
        }

        return null;
    },
    onError: async (error) => {
        if (error?.code === "PGRST301" || error?.code === 401) {
            return {
                logout: true,
            };
        }

        return { error };
    },
    forgotPassword: async ({ email }) => {

        const checkEmailExists = async (email: any) => {
            const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
            const emailExists = users.filter((item) => item.email === email);
            return emailExists.length  
        }

        try {
            const emailExists = await checkEmailExists(email);
            if (emailExists) {
                const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
                    email,
                    {
                        redirectTo: `${window.location.origin}/update-password`,
                    }
                );

                if (error) {
                    return {
                        success: false,
                        error,
                    };
                }

                if (data) {
                    return {
                        success: true,
                        successNotification: {
                            message:
                                "Please check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.",
                        },
                    };
                }
            }
            else {
                return {
                    success: false,
                    error: {
                        message: "Forgot password failed",
                        name: "Email address is not Registered",
                    },
                }
            }

        } catch (error: any) {
            return {
                success: false,
                error,
            };
        }

        return {
            success: false,
            error: {
                message: "Forgot password failed",
                name: "Invalid email",
            },
        };
    },
    updatePassword: async ({ password }) => {
        try {
            const { data, error } = await supabaseClient.auth.updateUser({
                password,
            });

            if (error) {
                return {
                    success: false,
                    error,
                };
            }

            if (data) {
                return {
                    success: true,
                    redirectTo: "/",
                };
            }
        } catch (error: any) {
            return {
                success: false,
                error,
            };
        }
        return {
            success: false,
            error: {
                message: "Update password failed",
                name: "Invalid password",
            },
        };
    },
};