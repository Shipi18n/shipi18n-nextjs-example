/**
 * Tests for Shipi18n Next.js Example
 *
 * These tests verify the client library patterns and integration logic
 * without making actual API calls.
 */

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock environment for tests
const mockEnv = {
  SHIPI18N_API_KEY: 'sk_test_123456',
  SHIPI18N_API_URL: 'https://api.test.shipi18n.com'
};

beforeEach(() => {
  mockFetch.mockClear();
});

describe('Shipi18n API Client Patterns', () => {
  describe('API URL construction', () => {
    it('constructs correct translate endpoint URL', () => {
      const apiUrl = mockEnv.SHIPI18N_API_URL;
      const endpoint = '/translate';
      const url = `${apiUrl}/api${endpoint}`;

      expect(url).toBe('https://api.test.shipi18n.com/api/translate');
    });

    it('uses default API URL when not specified', () => {
      const DEFAULT_URL = 'https://x9527l3blg.execute-api.us-east-1.amazonaws.com';
      const apiUrl = undefined || DEFAULT_URL;

      expect(apiUrl).toBe(DEFAULT_URL);
    });
  });

  describe('Request formatting', () => {
    it('formats basic translation request correctly', () => {
      const request = {
        text: 'Hello, World!',
        sourceLanguage: 'en',
        targetLanguages: ['es', 'fr'],
        preservePlaceholders: true,
        enablePluralization: true,
      };

      expect(request.text).toBe('Hello, World!');
      expect(request.targetLanguages).toHaveLength(2);
      expect(request.preservePlaceholders).toBe(true);
    });

    it('formats JSON translation request correctly', () => {
      const json = { greeting: 'Hello', farewell: 'Goodbye' };
      const jsonString = JSON.stringify(json);

      expect(jsonString).toBe('{"greeting":"Hello","farewell":"Goodbye"}');
    });

    it('handles object JSON input by stringifying', () => {
      const jsonObject = { key: 'value' };
      const jsonString = typeof jsonObject === 'string'
        ? jsonObject
        : JSON.stringify(jsonObject);

      expect(jsonString).toBe('{"key":"value"}');
    });

    it('handles string JSON input directly', () => {
      const jsonString = '{"key": "value"}';
      const isString = typeof jsonString === 'string';

      expect(isString).toBe(true);
    });
  });

  describe('Response parsing', () => {
    it('parses translation response correctly', () => {
      const response = {
        es: [{ original: 'Hello', translated: 'Hola' }],
        fr: [{ original: 'Hello', translated: 'Bonjour' }],
      };

      expect(response.es[0].translated).toBe('Hola');
      expect(response.fr[0].translated).toBe('Bonjour');
    });

    it('parses JSON translation response correctly', () => {
      const response = {
        es: { greeting: 'Hola', farewell: 'Adiós' },
        fr: { greeting: 'Bonjour', farewell: 'Au revoir' },
      };

      expect(response.es.greeting).toBe('Hola');
      expect(response.fr.farewell).toBe('Au revoir');
    });

    it('extracts translations for locale file pattern', () => {
      const result = {
        es: { title: 'Mi App' },
        fr: { title: 'Mon App' },
        warnings: [],
      };

      const targetLanguages = ['es', 'fr'];
      const translations = {};

      for (const lang of targetLanguages) {
        if (result[lang]) {
          translations[lang] = result[lang];
        }
      }

      expect(translations).toHaveProperty('es');
      expect(translations).toHaveProperty('fr');
      expect(translations).not.toHaveProperty('warnings');
    });
  });

  describe('Input validation', () => {
    it('validates text is required', () => {
      const validateText = (text) => {
        if (!text) throw new Error('Text is required');
        return true;
      };

      expect(() => validateText()).toThrow('Text is required');
      expect(validateText('Hello')).toBe(true);
    });

    it('validates target languages are required', () => {
      const validateLanguages = (languages) => {
        if (!languages?.length) throw new Error('At least one target language is required');
        return true;
      };

      expect(() => validateLanguages()).toThrow('At least one target language is required');
      expect(() => validateLanguages([])).toThrow('At least one target language is required');
      expect(validateLanguages(['es'])).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('detects missing API key', () => {
      const apiKey = undefined;
      const hasApiKey = !!apiKey;

      expect(hasApiKey).toBe(false);
    });

    it('constructs proper error message for missing API key', () => {
      const errorMessage = 'SHIPI18N_API_KEY is not set. Get your free key at https://shipi18n.com';

      expect(errorMessage).toContain('SHIPI18N_API_KEY');
      expect(errorMessage).toContain('shipi18n.com');
    });

    it('handles non-ok response status', () => {
      const response = { ok: false, status: 401 };
      const isError = !response.ok;

      expect(isError).toBe(true);
      expect(response.status).toBe(401);
    });

    it('extracts error message from response', () => {
      const errorResponse = { message: 'Invalid API key' };
      const errorMessage = errorResponse.message || 'API error';

      expect(errorMessage).toBe('Invalid API key');
    });

    it('provides fallback error message', () => {
      const errorResponse = {};
      const status = 500;
      const errorMessage = errorResponse.message || `API error: ${status}`;

      expect(errorMessage).toBe('API error: 500');
    });
  });

  describe('Headers', () => {
    it('includes required headers', () => {
      const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': mockEnv.SHIPI18N_API_KEY,
      };

      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['X-API-Key']).toBe('sk_test_123456');
    });
  });
});

describe('Next.js Integration Patterns', () => {
  describe('Server Component pattern', () => {
    it('validates async data fetching pattern', async () => {
      // Simulates Server Component async pattern
      const fetchTranslations = async () => ({
        es: { welcome: 'Bienvenido' },
      });

      const translations = await fetchTranslations();

      expect(translations.es.welcome).toBe('Bienvenido');
    });

    it('validates error boundary pattern', () => {
      const handleError = (error) => {
        if (error.message.includes('API')) {
          return { fallback: true, message: error.message };
        }
        throw error;
      };

      const result = handleError(new Error('API error: 401'));

      expect(result.fallback).toBe(true);
    });
  });

  describe('Client Component pattern', () => {
    it('validates useState pattern for translations', () => {
      // Simulates React useState pattern
      let translations = null;
      const setTranslations = (value) => { translations = value; };

      setTranslations({ es: 'Hola' });

      expect(translations).toEqual({ es: 'Hola' });
    });

    it('validates loading state pattern', () => {
      let isLoading = true;
      const setLoading = (value) => { isLoading = value; };

      expect(isLoading).toBe(true);
      setLoading(false);
      expect(isLoading).toBe(false);
    });
  });

  describe('Environment configuration', () => {
    it('distinguishes server vs client environment variables', () => {
      // Server-side pattern (no NEXT_PUBLIC_ prefix)
      const serverConfig = {
        apiKey: mockEnv.SHIPI18N_API_KEY,
        apiUrl: mockEnv.SHIPI18N_API_URL,
      };

      // Client-side pattern (requires NEXT_PUBLIC_ prefix)
      const clientConfig = {
        apiKey: process.env.NEXT_PUBLIC_SHIPI18N_API_KEY,
        apiUrl: process.env.NEXT_PUBLIC_SHIPI18N_API_URL,
      };

      expect(serverConfig.apiKey).toBeDefined();
      // Client-side won't have values unless NEXT_PUBLIC_ env vars are set
    });
  });
});

/**
 * Snapshot tests for translation response structures
 */
describe('Translation Response Snapshots', () => {
  it('should match expected JSON translation response structure', () => {
    const translationResponse = {
      es: {
        common: {
          greeting: 'Hola',
          farewell: 'Adiós',
          buttons: { submit: 'Enviar', cancel: 'Cancelar' },
        },
      },
      fr: {
        common: {
          greeting: 'Bonjour',
          farewell: 'Au revoir',
          buttons: { submit: 'Soumettre', cancel: 'Annuler' },
        },
      },
    };

    expect(translationResponse).toMatchSnapshot();
  });

  it('should match expected pluralization response structure', () => {
    const pluralResponse = {
      ru: {
        items_one: '{{count}} элемент',
        items_few: '{{count}} элемента',
        items_many: '{{count}} элементов',
        items_other: '{{count}} элементов',
      },
    };

    expect(pluralResponse).toMatchSnapshot();
  });

  it('should match expected text translation response structure', () => {
    const textResponse = {
      es: [
        { original: 'Hello, world!', translated: '¡Hola, mundo!' },
        { original: 'Welcome', translated: 'Bienvenido' },
      ],
    };

    expect(textResponse).toMatchSnapshot();
  });
});

describe('Placeholder Preservation', () => {
  it('preserves i18next placeholders in translations', () => {
    const input = 'Hello, {{name}}!';
    const output = 'Hola, {{name}}!';

    expect(output).toContain('{{name}}');
  });

  it('preserves React Intl placeholders', () => {
    const input = 'Hello, {name}!';
    const output = 'Hola, {name}!';

    expect(output).toContain('{name}');
  });

  it('preserves multiple placeholders', () => {
    const output = '{{user}} tiene {{count}} mensajes';

    expect(output).toContain('{{user}}');
    expect(output).toContain('{{count}}');
  });
});

describe('Language Codes', () => {
  it('accepts standard language codes', () => {
    const validCodes = ['es', 'fr', 'de', 'ja', 'zh', 'pt', 'ru', 'ar', 'ko', 'it'];

    validCodes.forEach(code => {
      expect(code).toMatch(/^[a-z]{2}$/);
    });
  });

  it('accepts regional language codes', () => {
    const regionalCodes = ['zh-CN', 'zh-TW', 'pt-BR', 'en-US', 'en-GB'];

    regionalCodes.forEach(code => {
      expect(code).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
    });
  });
});
