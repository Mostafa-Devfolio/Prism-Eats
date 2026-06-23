import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["en", "ar"] as const;
export const defaultLocale = "en" as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  const currentLocale = locale || defaultLocale;

  if (!locales.includes(currentLocale as (typeof locales)[number])) {
    notFound();
  }

  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`)).default,
  };
});
