import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

function mergeMessages(base: any, override: any): any {
  const result: any = { ...base };
  
  for (const key in override) {
    const overrideVal = override[key];
    const baseVal = base[key];
    
    if (typeof overrideVal === 'object' && overrideVal !== null && !Array.isArray(overrideVal)) {
      if (typeof baseVal === 'object' && baseVal !== null && !Array.isArray(baseVal)) {
        result[key] = mergeMessages(baseVal, overrideVal);
      } else {
        result[key] = overrideVal;
      }
    } else {
      if (overrideVal !== "") {
        result[key] = overrideVal;
      }
    }
  }
  return result;
}

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const defaultMessages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;
  let messages = defaultMessages;

  if (locale !== routing.defaultLocale) {
    const localeMessages = (await import(`../../messages/${locale}.json`)).default;
    messages = mergeMessages(defaultMessages, localeMessages);
  }

  return {
    locale,
    messages
  };
});
