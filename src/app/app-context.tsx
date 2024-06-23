"use client";
import { notificationProvider, RefineSnackbarProvider } from "@refinedev/mui";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import React, { PropsWithChildren } from "react";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { dataProvider } from "@providers/data-provider";
import { authProvider } from "@providers/auth-provider";
import { useTranslation } from "next-i18next";
import ChatBox from '@components/chat-icon';

// initialize i18n
import "../providers/i18n";

type Props = {
    themeMode?: string;
};

export const RefineContext = ({
    themeMode,
    children,
}: PropsWithChildren<Props>) => {
    const { t, i18n } = useTranslation();
    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    return (
      <>
        <RefineKbarProvider>
          <ColorModeContextProvider defaultMode={themeMode}>
            <RefineSnackbarProvider>
              <Refine
                routerProvider={routerProvider}
                authProvider={authProvider}
                dataProvider={dataProvider}
                notificationProvider={notificationProvider}
                i18nProvider={i18nProvider}
                resources={[
                  {
                    name: "dashboard",
                    list: "/dashboard",
                    options: { route: "/dashboard" },
                  },
                  {
                    name: "jobs",
                    list: "/jobs",
                    create: "/jobs/create",
                    edit: "/jobs/edit/:id",
                    show: "/jobs/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "companies",
                    list: "/companies",
                    create: "/companies/create",
                    edit: "/companies/edit/:id",
                    show: "/companies/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "users",
                    list: "/users",
                    create: "/users/create",
                    edit: "/users/edit/:id",
                    show: "/users/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "matchings",
                    list: "/matchings",
                    create: "/matchings/create",
                    edit: "/matchings/edit/:id",
                    show: "/matchings/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "vkonvyvcctiniedyjptm",
                }}
              >
                {children}
                <RefineKbar />
                <ChatBox/>
              </Refine>
            </RefineSnackbarProvider>
          </ColorModeContextProvider>
        </RefineKbarProvider>
      </>
    );
};
