"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import initTranslations from "@/app/i18n";
import { createInstance, Resource } from "i18next";

export default function IntlProvider({
  children,
  locale,
  namespaces,
  resources,
}: {
  children: ReactNode;
  locale: string;
  namespaces: string[] | undefined;
  resources: Resource | undefined;
}) {
  const i18n = createInstance();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      await initTranslations(locale, namespaces, i18n, resources);
      setIsInitialized(true);
    })();
  }, [locale, namespaces, resources]);

  if (!isInitialized) return null; // Render nothing until i18n is initialized

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
