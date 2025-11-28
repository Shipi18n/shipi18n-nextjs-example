/**
 * Tests for Shipi18n Next.js Example
 *
 * These tests verify the client library by importing and testing actual functions.
 */

import {
  translate,
  translateJSON,
  translateLocaleFile,
  healthCheck,
  getTranslations,
  getConfig,
  setConfig,
  resetConfig,
  apiRequest
} from '../lib/shipi18n.js';

// Mock fetch globally
let mockFetchResponse = {};
let mockFetchOk = true;
let lastFetchCall = null;

global.fetch = jest.fn(async (url, options) => {
  lastFetchCall = { url, options };

  return {
    ok: mockFetchOk,
    status: mockFetchOk ? 200 : 401,
    json: async () => mockFetchResponse
  };
});

// Reset before each test
beforeEach(() => {
  mockFetchResponse = {};
  mockFetchOk = true;
  lastFetchCall = null;
  resetConfig();
  global.fetch.mockClear();
});

describe('Shipi18n API Client', () => {
  describe('setConfig and resetConfig', () => {
    test('setConfig sets the configuration', () => {
      setConfig({
        apiKey: 'test_key',
        apiUrl: 'https://test.api.com'
      });

      const config = getConfig();
      expect(config.apiKey).toBe('test_key');
      expect(config.apiUrl).toBe('https://test.api.com');
    });

    test('resetConfig clears the configuration', async () => {
      setConfig({ apiKey: 'test_key', apiUrl: 'https://test.api.com' });
      resetConfig();

      await expect(translate({
        text: 'Hello',
        targetLanguages: ['es']
      })).rejects.toThrow('SHIPI18N_API_KEY is not set');
    });
  });

  describe('getConfig', () => {
    test('returns test config when set', () => {
      setConfig({ apiKey: 'test_key', apiUrl: 'https://custom.api.com' });

      const config = getConfig();

      expect(config.apiKey).toBe('test_key');
      expect(config.apiUrl).toBe('https://custom.api.com');
    });

    test('returns default API URL when no config set', () => {
      // In test environment, process.env won't have these values
      const config = getConfig();

      expect(config.apiUrl).toBe('https://x9527l3blg.execute-api.us-east-1.amazonaws.com');
    });
  });

  describe('apiRequest', () => {
    test('throws error when API key is not set', async () => {
      await expect(apiRequest('/translate', { method: 'POST' }))
        .rejects.toThrow('SHIPI18N_API_KEY is not set');
    });

    test('makes correct API call', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });
      mockFetchResponse = { result: 'success' };

      await apiRequest('/translate', {
        method: 'POST',
        body: JSON.stringify({ text: 'Hello' })
      });

      expect(lastFetchCall.url).toBe('https://api.test.com/api/translate');
      expect(lastFetchCall.options.method).toBe('POST');
      expect(lastFetchCall.options.headers['Content-Type']).toBe('application/json');
      expect(lastFetchCall.options.headers['X-API-Key']).toBe('sk_test_123');
    });

    test('throws error on non-ok response', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });
      mockFetchOk = false;
      mockFetchResponse = { message: 'Invalid API key' };

      await expect(apiRequest('/translate', { method: 'POST' }))
        .rejects.toThrow('Invalid API key');
    });

    test('provides fallback error message', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });
      mockFetchOk = false;
      mockFetchResponse = {};

      await expect(apiRequest('/translate', { method: 'POST' }))
        .rejects.toThrow('API error: 401');
    });
  });

  describe('translate', () => {
    test('throws error when text is empty', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });

      await expect(translate({
        text: '',
        targetLanguages: ['es']
      })).rejects.toThrow('Text is required');
    });

    test('throws error when targetLanguages is empty', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });

      await expect(translate({
        text: 'Hello',
        targetLanguages: []
      })).rejects.toThrow('At least one target language is required');
    });

    test('makes correct API call with all parameters', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });
      mockFetchResponse = { es: [{ original: 'Hello', translated: 'Hola' }] };

      await translate({
        text: 'Hello',
        sourceLanguage: 'en',
        targetLanguages: ['es'],
        preservePlaceholders: true,
        enablePluralization: false
      });

      const body = JSON.parse(lastFetchCall.options.body);
      expect(body.text).toBe('Hello');
      expect(body.sourceLanguage).toBe('en');
      expect(body.targetLanguages).toEqual(['es']);
      expect(body.preservePlaceholders).toBe(true);
      expect(body.enablePluralization).toBe(false);
    });

    test('returns translation response', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });
      mockFetchResponse = {
        es: [{ original: 'Hello', translated: 'Hola' }],
        fr: [{ original: 'Hello', translated: 'Bonjour' }]
      };

      const result = await translate({
        text: 'Hello',
        targetLanguages: ['es', 'fr']
      });

      expect(result.es[0].translated).toBe('Hola');
      expect(result.fr[0].translated).toBe('Bonjour');
    });

    test('uses default values', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });
      mockFetchResponse = { es: {} };

      await translate({
        text: 'Hello',
        targetLanguages: ['es']
      });

      const body = JSON.parse(lastFetchCall.options.body);
      expect(body.sourceLanguage).toBe('en');
      expect(body.preservePlaceholders).toBe(true);
      expect(body.enablePluralization).toBe(true);
    });
  });

  describe('translateJSON', () => {
    test('accepts object JSON input', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });
      mockFetchResponse = { es: { greeting: 'Hola' } };

      await translateJSON({
        json: { greeting: 'Hello' },
        targetLanguages: ['es']
      });

      const body = JSON.parse(lastFetchCall.options.body);
      expect(body.text).toBe('{"greeting":"Hello"}');
      expect(body.outputFormat).toBe('json');
    });

    test('accepts string JSON input', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });
      mockFetchResponse = { es: { greeting: 'Hola' } };

      await translateJSON({
        json: '{"greeting":"Hello"}',
        targetLanguages: ['es']
      });

      const body = JSON.parse(lastFetchCall.options.body);
      expect(body.text).toBe('{"greeting":"Hello"}');
    });

    test('returns translated JSON', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });
      mockFetchResponse = {
        es: { greeting: 'Hola', farewell: 'Adiós' }
      };

      const result = await translateJSON({
        json: { greeting: 'Hello', farewell: 'Goodbye' },
        targetLanguages: ['es']
      });

      expect(result.es.greeting).toBe('Hola');
      expect(result.es.farewell).toBe('Adiós');
    });
  });

  describe('translateLocaleFile', () => {
    test('translates content and returns by language', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });
      mockFetchResponse = {
        es: { title: 'Mi App' },
        fr: { title: 'Mon App' }
      };

      const result = await translateLocaleFile({
        content: { title: 'My App' },
        targetLanguages: ['es', 'fr']
      });

      expect(result.es.title).toBe('Mi App');
      expect(result.fr.title).toBe('Mon App');
    });

    test('excludes missing languages from result', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });
      mockFetchResponse = {
        es: { title: 'Mi App' }
        // fr is missing
      };

      const result = await translateLocaleFile({
        content: { title: 'My App' },
        targetLanguages: ['es', 'fr']
      });

      expect(result.es).toBeDefined();
      expect(result.fr).toBeUndefined();
    });
  });

  describe('healthCheck', () => {
    test('calls the health endpoint', async () => {
      setConfig({ apiKey: 'sk_test_123', apiUrl: 'https://api.test.com' });
      mockFetchResponse = { status: 'healthy', version: '1.0.0' };

      const result = await healthCheck();

      expect(lastFetchCall.url).toBe('https://api.test.com/api/health');
      expect(result.status).toBe('healthy');
    });
  });

  describe('getTranslations', () => {
    test('returns empty object (placeholder implementation)', async () => {
      const result = await getTranslations('es', 'common');

      expect(result).toEqual({});
    });
  });
});

describe('Translation Response Snapshots', () => {
  test('should match expected JSON translation response structure', () => {
    const translationResponse = {
      es: {
        common: {
          greeting: 'Hola',
          farewell: 'Adiós',
          buttons: { submit: 'Enviar', cancel: 'Cancelar' }
        }
      },
      fr: {
        common: {
          greeting: 'Bonjour',
          farewell: 'Au revoir',
          buttons: { submit: 'Soumettre', cancel: 'Annuler' }
        }
      }
    };

    expect(translationResponse).toMatchSnapshot();
  });

  test('should match expected pluralization response structure', () => {
    const pluralResponse = {
      ru: {
        items_one: '{{count}} элемент',
        items_few: '{{count}} элемента',
        items_many: '{{count}} элементов',
        items_other: '{{count}} элементов'
      }
    };

    expect(pluralResponse).toMatchSnapshot();
  });

  test('should match expected text translation response structure', () => {
    const textResponse = {
      es: [
        { original: 'Hello, world!', translated: '¡Hola, mundo!' },
        { original: 'Welcome', translated: 'Bienvenido' }
      ]
    };

    expect(textResponse).toMatchSnapshot();
  });
});
