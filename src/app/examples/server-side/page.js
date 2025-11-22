import { translate } from '@/lib/shipi18n'
import Link from 'next/link'

// This is a Server Component - translations happen on the server!
export default async function ServerSideExample() {
  let translations = null
  let error = null

  const sampleText = 'Welcome to our platform! We help developers ship faster.'

  try {
    translations = await translate({
      text: sampleText,
      targetLanguages: ['es', 'fr', 'de', 'ja'],
      preservePlaceholders: true,
    })
  } catch (err) {
    error = err.message
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="text-blue-600 hover:underline">&larr; Back to examples</Link>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ⚡ Server-Side Translation
        </h1>
        <p className="text-gray-600 mb-6">
          This page uses React Server Components to translate text at request time.
          The translation happens on the server before the page is sent to the browser.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">Benefits</h3>
          <ul className="text-green-700 space-y-1">
            <li>✓ SEO-friendly (content is in the HTML)</li>
            <li>✓ No loading spinner on the client</li>
            <li>✓ API key stays on the server (secure!)</li>
            <li>✓ Faster initial page load</li>
          </ul>
        </div>

        {/* Original Text */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">Original (English):</h3>
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-gray-900">{sampleText}</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Translation Error</p>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2">
              Make sure your API key is set in <code>.env.local</code>
            </p>
          </div>
        )}

        {/* Translations */}
        {translations && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Server-Rendered Translations:</h3>
            {Object.entries(translations).map(([lang, items]) => (
              <div key={lang} className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium text-gray-700 mb-2 uppercase">{lang}</div>
                {Array.isArray(items) ? (
                  items.map((item, i) => (
                    <p key={i} className="text-gray-900">{item.translated}</p>
                  ))
                ) : (
                  <p className="text-gray-900">{JSON.stringify(items)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Code Example */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Code Example</h2>
        <pre className="text-sm">{`// This is a Server Component (no 'use client')
import { translate } from '@/lib/shipi18n'

export default async function Page() {
  // Translation happens on the server!
  const translations = await translate({
    text: 'Welcome to our platform!',
    targetLanguages: ['es', 'fr', 'de'],
  })

  return (
    <div>
      {Object.entries(translations).map(([lang, items]) => (
        <p key={lang}>
          {lang}: {items[0].translated}
        </p>
      ))}
    </div>
  )
}`}</pre>
      </div>
    </div>
  )
}
