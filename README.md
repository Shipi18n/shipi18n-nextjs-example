# Shipi18n Next.js Example

A Next.js 14 application demonstrating how to integrate the [Shipi18n](https://shipi18n.com) translation API using the App Router.

> **Get Started in 30 Seconds**: Sign up at [shipi18n.com](https://shipi18n.com) to get your free API key instantly. No credit card required!

## Features

This example demonstrates multiple integration patterns:

- **Client-Side Translation** - Interactive translations in React Client Components
- **Server-Side Translation** - SEO-friendly translations in Server Components
- **File Translation** - Upload `en.json` → Download `es.json`, `fr.json`, etc.
- **API Route Proxy** - Keep your API key secure on the server
- **100+ Languages** - Translate to any language Google Translate supports
- **Placeholder Preservation** - Keeps `{name}`, `{{value}}`, `%s` intact
- **i18next Pluralization** - Auto-generates CLDR-compliant plural forms

## Prerequisites

- Node.js 18+ installed
- Free API key from [shipi18n.com](https://shipi18n.com)

## Quick Start

### 1. Get Your Free API Key

Visit [shipi18n.com](https://shipi18n.com) and sign up:

- **Free tier**: 100 translation keys, 3 languages
- **No credit card** required
- **Instant access**

### 2. Clone and Install

```bash
git clone https://github.com/Shipi18n/shipi18n-nextjs-example.git
cd shipi18n-nextjs-example
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Only ONE key needed!
SHIPI18N_API_KEY=sk_live_your_api_key_here
```

> **Note**: You only need `SHIPI18N_API_KEY`. See [Environment Variables](#environment-variables) for details.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
shipi18n-nextjs-example/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── translate/
│   │   │       └── route.js          # API route proxy
│   │   ├── examples/
│   │   │   ├── client-side/
│   │   │   │   └── page.js           # Client Component example
│   │   │   ├── server-side/
│   │   │   │   └── page.js           # Server Component example
│   │   │   ├── file-translation/
│   │   │   │   └── page.js           # File upload/download
│   │   │   └── api-route/
│   │   │       └── page.js           # API route demo
│   │   ├── layout.js
│   │   ├── page.js                   # Home page
│   │   └── globals.css
│   └── lib/
│       └── shipi18n.js               # API client
├── .env.example
├── package.json
└── README.md
```

## Usage Examples

### Client-Side Translation

```jsx
'use client'
import { translate } from '@/lib/shipi18n'

export default function MyComponent() {
  const [result, setResult] = useState(null)

  const handleTranslate = async () => {
    const translations = await translate({
      text: 'Hello, World!',
      targetLanguages: ['es', 'fr', 'de'],
    })
    setResult(translations)
  }

  return <button onClick={handleTranslate}>Translate</button>
}
```

### Server-Side Translation (Server Component)

```jsx
// No 'use client' - this is a Server Component
import { translate } from '@/lib/shipi18n'

export default async function Page() {
  const translations = await translate({
    text: 'Welcome to our app!',
    targetLanguages: ['es', 'fr'],
  })

  return (
    <div>
      <p>Spanish: {translations.es[0].translated}</p>
      <p>French: {translations.fr[0].translated}</p>
    </div>
  )
}
```

### API Route Proxy

```js
// src/app/api/translate/route.js
import { translate } from '@/lib/shipi18n'

export async function POST(request) {
  const { text, targetLanguages } = await request.json()

  const result = await translate({
    text,
    targetLanguages,
    preservePlaceholders: true,
  })

  return Response.json(result)
}
```

### JSON File Translation

```jsx
import { translateJSON } from '@/lib/shipi18n'

const localeFile = {
  greeting: 'Hello',
  farewell: 'Goodbye',
}

const translations = await translateJSON({
  json: localeFile,
  targetLanguages: ['es', 'fr'],
})

// Result:
// {
//   es: { greeting: 'Hola', farewell: 'Adiós' },
//   fr: { greeting: 'Bonjour', farewell: 'Au revoir' }
// }
```

### i18next Pluralization

Shipi18n auto-generates CLDR-compliant plural forms based on each target language's rules:

- **English/Spanish**: `_one`, `_other` (2 forms)
- **Russian**: `_one`, `_few`, `_many`, `_other` (4 forms)
- **Arabic**: `_zero`, `_one`, `_two`, `_few`, `_many`, `_other` (6 forms)

```jsx
import { translateJSON } from '@/lib/shipi18n'

const result = await translateJSON({
  json: {
    "item_one": "{{count}} item",
    "item_other": "{{count}} items"
  },
  targetLanguages: ['es', 'ru'],
  enablePluralization: true  // enabled by default
})

// Spanish (2 forms): { item_one: "{{count}} artículo", item_other: "{{count}} artículos" }
// Russian (4 forms): { item_one, item_few, item_many, item_other } - auto-generated!
```

## API Reference

### `translate(options)`

Translate text to multiple languages.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to translate |
| `sourceLanguage` | string | No | Source language (default: 'en') |
| `targetLanguages` | string[] | Yes | Target language codes |
| `preservePlaceholders` | boolean | No | Keep placeholders intact (default: true) |
| `enablePluralization` | boolean | No | Auto-generate i18next plural forms (default: true) |

### `translateJSON(options)`

Translate JSON while preserving structure.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `json` | object/string | Yes | JSON to translate |
| `sourceLanguage` | string | No | Source language (default: 'en') |
| `targetLanguages` | string[] | Yes | Target language codes |
| `preservePlaceholders` | boolean | No | Keep placeholders intact (default: true) |
| `enablePluralization` | boolean | No | Auto-generate i18next plural forms (default: true) |

## Environment Variables

**You only need ONE API key!**

| Variable | Description | Required |
|----------|-------------|----------|
| `SHIPI18N_API_KEY` | Your API key (server-side only) | **Yes** |
| `SHIPI18N_API_URL` | API URL (optional) | No |

### Why only one key?

In Next.js, environment variables are **server-side only by default**. The `SHIPI18N_API_KEY` is:
- Accessible in API routes, Server Components, and middleware
- **Never exposed to the browser** - your key stays secure

### What about `NEXT_PUBLIC_` variables?

The `NEXT_PUBLIC_` prefix tells Next.js to expose a variable to the browser. **We don't recommend this** because:
- Your API key would be visible in the browser's page source
- Anyone could copy your key and use your quota

### Recommended Architecture

```
Browser (Client Component)
    ↓
/api/translate (API Route - uses SHIPI18N_API_KEY securely)
    ↓
Shipi18n API
```

This example uses this pattern - all client-side examples call `/api/translate` instead of calling Shipi18n directly.

## Pricing

| Tier | Price | Keys | Languages | Rate Limit |
|------|-------|------|-----------|------------|
| **FREE** | $0/mo | 100 | 3 | 10 req/min |
| **STARTER** | $9/mo | 500 | 10 | 60 req/min |
| **PRO** | $29/mo | 10,000 | 100+ | 300 req/min |
| **ENTERPRISE** | Custom | Unlimited | Custom | 1000+ req/min |

## Learn More

- [Shipi18n Documentation](https://shipi18n.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React i18n Best Practices](https://shipi18n.com/blog/react-i18n)

## Related Projects

- [shipi18n-react-example](https://github.com/Shipi18n/shipi18n-react-example) - Vite + React example
- [shipi18n-cli](https://github.com/Shipi18n/shipi18n-cli) - Command-line tool

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with [Shipi18n](https://shipi18n.com) - Smart translation API for developers
