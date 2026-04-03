import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ru from './ru.json';
import tt from './tt.json';
import en from './en.json';

const resources = {
  ru: { translation: ru },
  tt: { translation: tt },
  en: { translation: en }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
