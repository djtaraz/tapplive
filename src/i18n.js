import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

export const SUPPORTED_LANGUAGES = ['en', 'ru']

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: SUPPORTED_LANGUAGES[0],
        whitelist: SUPPORTED_LANGUAGES,
        supportedLngs: SUPPORTED_LANGUAGES,
        interpolation: {
            escapeValue: false,
        },
    })

i18n.on('languageChanged', (lng) => {
    document.documentElement.setAttribute('lang', lng)
})

export default i18n
