'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

// Use our API route to keep the API key secure
async function translateJSON({ json, targetLanguages }) {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: JSON.stringify(json),
      targetLanguages,
      preservePlaceholders: true,
      outputFormat: 'json',
    }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Translation failed')
  }
  return response.json()
}

const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
]

export default function FileTranslationExample() {
  const [fileContent, setFileContent] = useState(null)
  const [fileName, setFileName] = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState(['es', 'fr'])
  const [translations, setTranslations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result)
        setFileContent(json)
        setError(null)
      } catch (err) {
        setError('Invalid JSON file')
        setFileContent(null)
      }
    }

    reader.readAsText(file)
  }

  const handleTranslate = async () => {
    if (!fileContent) return

    setLoading(true)
    setError(null)

    try {
      const result = await translateJSON({
        json: fileContent,
        targetLanguages: selectedLanguages,
        preservePlaceholders: true,
      })
      setTranslations(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const downloadTranslation = (lang, content) => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${lang}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleLanguage = (code) => {
    setSelectedLanguages(prev =>
      prev.includes(code)
        ? prev.filter(l => l !== code)
        : [...prev, code]
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="text-blue-600 hover:underline">&larr; Back to examples</Link>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          📁 File Translation
        </h1>
        <p className="text-gray-600 mb-6">
          Upload your locale JSON file (e.g., en.json) and download translated versions
          for each language. This is how developers actually use Shipi18n in production!
        </p>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload locale file
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            {fileName ? (
              <div>
                <p className="text-lg font-medium text-gray-900">{fileName}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {fileContent ? `${Object.keys(fileContent).length} top-level keys` : 'Parsing...'}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-600">Click or drag to upload JSON file</p>
                <p className="text-sm text-gray-400 mt-1">en.json, messages.json, etc.</p>
              </div>
            )}
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target languages
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedLanguages.includes(lang.code)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={loading || !fileContent || selectedLanguages.length === 0}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Translating...' : `Translate to ${selectedLanguages.length} language(s)`}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Results */}
        {translations && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Download Translated Files:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(translations).map(([lang, content]) => (
                <button
                  key={lang}
                  onClick={() => downloadTranslation(lang, content)}
                  className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 py-3 px-4 rounded-lg transition-colors"
                >
                  <span>📥</span>
                  <span className="font-medium">{lang}.json</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sample File */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Sample Locale File</h2>
        <p className="text-gray-600 mb-4">
          Try uploading a JSON file like this:
        </p>
        <pre className="text-sm">{`{
  "app": {
    "title": "My Application",
    "welcome": "Welcome, {name}!"
  },
  "auth": {
    "login": "Log in",
    "logout": "Log out",
    "signup": "Sign up"
  },
  "errors": {
    "notFound": "Page not found",
    "serverError": "Something went wrong"
  }
}`}</pre>
      </div>
    </div>
  )
}
