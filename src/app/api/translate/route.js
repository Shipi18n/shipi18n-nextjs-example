import { translate, translateJSON } from '@/lib/shipi18n'

export async function POST(request) {
  try {
    const { text, targetLanguages, preservePlaceholders = true, outputFormat } = await request.json()

    // Validate input
    if (!text) {
      return Response.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    if (!targetLanguages || targetLanguages.length === 0) {
      return Response.json(
        { error: 'At least one target language is required' },
        { status: 400 }
      )
    }

    // You can add custom logic here:
    // - Rate limiting per user
    // - Check user authentication
    // - Log translations for analytics
    // - Cache translations in your database

    let result

    if (outputFormat === 'json') {
      // JSON translation - preserves structure
      result = await translateJSON({
        json: text,
        targetLanguages,
        preservePlaceholders,
      })
    } else {
      // Plain text translation
      result = await translate({
        text,
        targetLanguages,
        preservePlaceholders,
      })
    }

    return Response.json(result)
  } catch (error) {
    console.error('Translation error:', error)
    return Response.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    )
  }
}
