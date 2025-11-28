/**
 * Shipi18n API Client for Next.js
 *
 * Works in both Server Components and Client Components.
 * Uses native fetch API for zero dependencies.
 */

// Configuration - can be overridden for testing
let testConfig = null

/**
 * Set configuration (useful for testing)
 * @param {Object} newConfig - Configuration object
 * @param {string} newConfig.apiKey - API key
 * @param {string} newConfig.apiUrl - API URL
 */
export function setConfig(newConfig) {
  testConfig = newConfig
}

/**
 * Reset configuration to defaults (useful for testing)
 */
export function resetConfig() {
  testConfig = null
}

// Get config from environment variables or test override
export const getConfig = () => {
  if (testConfig) return testConfig

  // Server-side (no NEXT_PUBLIC_ prefix needed)
  if (typeof window === 'undefined') {
    return {
      apiKey: process.env.SHIPI18N_API_KEY,
      apiUrl: process.env.SHIPI18N_API_URL || 'https://x9527l3blg.execute-api.us-east-1.amazonaws.com'
    }
  }
  // Client-side (needs NEXT_PUBLIC_ prefix)
  return {
    apiKey: process.env.NEXT_PUBLIC_SHIPI18N_API_KEY,
    apiUrl: process.env.NEXT_PUBLIC_SHIPI18N_API_URL || 'https://x9527l3blg.execute-api.us-east-1.amazonaws.com'
  }
}

/**
 * Make authenticated API request
 */
export async function apiRequest(endpoint, options = {}) {
  const { apiKey, apiUrl } = getConfig()

  if (!apiKey) {
    throw new Error('SHIPI18N_API_KEY is not set. Get your free key at https://shipi18n.com')
  }

  const url = `${apiUrl}/api${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API error: ${response.status}`)
  }

  return response.json()
}

/**
 * Translate text to one or more languages
 *
 * @example
 * const result = await translate({
 *   text: 'Hello, World!',
 *   targetLanguages: ['es', 'fr', 'de']
 * })
 */
export async function translate({
  text,
  sourceLanguage = 'en',
  targetLanguages,
  preservePlaceholders = true,
  enablePluralization = true,
}) {
  if (!text) throw new Error('Text is required')
  if (!targetLanguages?.length) throw new Error('At least one target language is required')

  return apiRequest('/translate', {
    method: 'POST',
    body: JSON.stringify({
      text,
      sourceLanguage,
      targetLanguages,
      preservePlaceholders,
      enablePluralization,
    }),
  })
}

/**
 * Translate JSON while preserving structure
 *
 * @example
 * const result = await translateJSON({
 *   json: { greeting: 'Hello', farewell: 'Goodbye' },
 *   targetLanguages: ['es']
 * })
 */
export async function translateJSON({
  json,
  sourceLanguage = 'en',
  targetLanguages,
  preservePlaceholders = true,
  enablePluralization = true,
}) {
  const jsonString = typeof json === 'string' ? json : JSON.stringify(json)

  return apiRequest('/translate', {
    method: 'POST',
    body: JSON.stringify({
      text: jsonString,
      sourceLanguage,
      targetLanguages,
      preservePlaceholders,
      enablePluralization,
      outputFormat: 'json',
    }),
  })
}

/**
 * Translate a locale file (upload JSON, get translated JSONs back)
 *
 * @example
 * const translations = await translateLocaleFile({
 *   content: { app: { title: 'My App' } },
 *   targetLanguages: ['es', 'fr']
 * })
 * // Returns: { es: { app: { title: 'Mi aplicación' } }, fr: { ... } }
 */
export async function translateLocaleFile({
  content,
  sourceLanguage = 'en',
  targetLanguages,
  preservePlaceholders = true,
  enablePluralization = true,
}) {
  const result = await translateJSON({
    json: content,
    sourceLanguage,
    targetLanguages,
    preservePlaceholders,
    enablePluralization,
  })

  // Transform to { lang: translatedJson } format
  const translations = {}
  for (const lang of targetLanguages) {
    if (result[lang]) {
      translations[lang] = result[lang]
    }
  }

  return translations
}

/**
 * Check API health
 */
export async function healthCheck() {
  const { apiUrl } = getConfig()
  const response = await fetch(`${apiUrl}/api/health`)
  return response.json()
}

/**
 * Server-side helper: Translate at build time or request time
 * Use this in Server Components or getStaticProps/getServerSideProps
 */
export async function getTranslations(locale, namespace = 'common') {
  // This is a placeholder - in a real app, you'd fetch from your CMS
  // or use the translateJSON function to translate on-demand
  return {}
}

export default {
  translate,
  translateJSON,
  translateLocaleFile,
  healthCheck,
  getTranslations,
  getConfig,
  setConfig,
  resetConfig,
  apiRequest
}
