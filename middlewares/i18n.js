const fs = require('fs');
const path = require('path');

class I18n {
    constructor() {
        this.locales = {};
        this.defaultLocale = 'id'; // Indonesian as default
        this.supportedLocales = ['id', 'en', 'ar']; // Indonesian, English, Arabic
        this.loadTranslations();
    }

    loadTranslations() {
        const localesDir = path.join(__dirname, '../locales');
        
        this.supportedLocales.forEach(locale => {
            try {
                const filePath = path.join(localesDir, `${locale}.json`);
                if (fs.existsSync(filePath)) {
                    this.locales[locale] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                }
            } catch (error) {
                console.error(`Error loading locale ${locale}:`, error);
            }
        });
    }

    detectLanguage(req) {
        // Priority: URL parameter > Cookie > Session > Accept-Language header > Default
        
        // 1. Check URL parameter
        if (req.query.lang && this.supportedLocales.includes(req.query.lang)) {
            return req.query.lang;
        }

        // 2. Check cookie
        if (req.cookies && req.cookies.locale && this.supportedLocales.includes(req.cookies.locale)) {
            return req.cookies.locale;
        }

        // 3. Check session
        if (req.session && req.session.locale && this.supportedLocales.includes(req.session.locale)) {
            return req.session.locale;
        }

        // 4. Check Accept-Language header
        const acceptLanguage = req.headers['accept-language'];
        if (acceptLanguage) {
            const languages = acceptLanguage.split(',').map(lang => {
                const [code] = lang.trim().split(';');
                return code.toLowerCase();
            });

            for (const lang of languages) {
                // Check exact match
                if (this.supportedLocales.includes(lang)) {
                    return lang;
                }
                
                // Check language without region (e.g., 'en' from 'en-US')
                const shortLang = lang.split('-')[0];
                if (this.supportedLocales.includes(shortLang)) {
                    return shortLang;
                }
            }
        }

        // 5. Default fallback
        return this.defaultLocale;
    }

    translate(key, locale = this.defaultLocale, params = {}) {
        const translations = this.locales[locale] || this.locales[this.defaultLocale];
        
        if (!translations) {
            return key;
        }

        // Support nested keys with dot notation (e.g., 'header.navigation.home')
        const value = key.split('.').reduce((obj, k) => obj && obj[k], translations);
        
        if (!value) {
            // Fallback to default locale if translation not found
            const fallbackTranslations = this.locales[this.defaultLocale];
            const fallbackValue = key.split('.').reduce((obj, k) => obj && obj[k], fallbackTranslations);
            return fallbackValue || key;
        }

        // Replace parameters in translation string
        let result = value;
        Object.keys(params).forEach(param => {
            result = result.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
        });

        return result;
    }

    getAvailableLocales() {
        return this.supportedLocales.map(locale => ({
            code: locale,
            name: this.getLocaleName(locale),
            flag: this.getLocaleFlag(locale)
        }));
    }

    getLocaleName(locale) {
        const names = {
            'id': 'Bahasa Indonesia',
            'en': 'English',
            'ar': 'العربية'
        };
        return names[locale] || locale;
    }

    getLocaleFlag(locale) {
        const flags = {
            'id': '🇮🇩',
            'en': '🇺🇸',
            'ar': '🇸🇦'
        };
        return flags[locale] || '🌐';
    }

    middleware() {
        return (req, res, next) => {
            const locale = this.detectLanguage(req);
            
            // Store locale in request and session
            req.locale = locale;
            if (req.session) {
                req.session.locale = locale;
            }

            // Set locale cookie (expires in 1 year)
            res.cookie('locale', locale, { 
                maxAge: 365 * 24 * 60 * 60 * 1000, 
                httpOnly: false 
            });

            // Make translation function available in templates
            res.locals.t = (key, params = {}) => this.translate(key, locale, params);
            res.locals.locale = locale;
            res.locals.availableLocales = this.getAvailableLocales();
            res.locals.isRTL = locale === 'ar'; // Right-to-left for Arabic

            // Make translation function available in request
            req.t = (key, params = {}) => this.translate(key, locale, params);

            next();
        };
    }
}

// Create singleton instance
const i18n = new I18n();

module.exports = i18n;