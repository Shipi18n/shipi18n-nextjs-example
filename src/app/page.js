import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Intro */}
      <section className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Next.js + Shipi18n Integration Examples
        </h2>
        <p className="text-gray-600 mb-6">
          This example demonstrates different ways to integrate Shipi18n translations
          into your Next.js application using the App Router.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Quick Start</h3>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Sign up at <a href="https://shipi18n.com" className="underline">shipi18n.com</a> (free, instant)</li>
            <li>Copy <code className="bg-blue-100 px-1 rounded">.env.example</code> to <code className="bg-blue-100 px-1 rounded">.env.local</code></li>
            <li>Add your API key</li>
            <li>Run <code className="bg-blue-100 px-1 rounded">npm run dev</code></li>
          </ol>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Client-Side Translation */}
        <Link href="/examples/client-side" className="block">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow h-full">
            <div className="text-3xl mb-3">🖥️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Client-Side Translation</h3>
            <p className="text-gray-600 mb-4">
              Interactive translation in the browser. Perfect for user-initiated translations
              and dynamic content.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✓ Real-time translation</li>
              <li>✓ User language selection</li>
              <li>✓ Loading states</li>
            </ul>
          </div>
        </Link>

        {/* Server-Side Translation */}
        <Link href="/examples/server-side" className="block">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow h-full">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Server-Side Translation</h3>
            <p className="text-gray-600 mb-4">
              Translate at request time in Server Components. Great for SEO and
              initial page load performance.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✓ SEO-friendly</li>
              <li>✓ No client JS needed</li>
              <li>✓ Server Component</li>
            </ul>
          </div>
        </Link>

        {/* File Translation */}
        <Link href="/examples/file-translation" className="block">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow h-full">
            <div className="text-3xl mb-3">📁</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">File Translation</h3>
            <p className="text-gray-600 mb-4">
              Upload your locale JSON file and download translated versions.
              The realistic developer workflow!
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✓ Upload en.json</li>
              <li>✓ Download es.json, fr.json, etc.</li>
              <li>✓ Preserves structure</li>
            </ul>
          </div>
        </Link>

        {/* API Route */}
        <Link href="/examples/api-route" className="block">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow h-full">
            <div className="text-3xl mb-3">🔌</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">API Route Proxy</h3>
            <p className="text-gray-600 mb-4">
              Use Next.js API routes to proxy translation requests. Keeps your
              API key secure on the server.
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>✓ Hide API key from client</li>
              <li>✓ Add custom logic</li>
              <li>✓ Rate limiting</li>
            </ul>
          </div>
        </Link>
      </section>

      {/* Pricing */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pricing</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="font-bold text-gray-900">FREE</h4>
            <p className="text-3xl font-bold text-gray-900 my-2">$0</p>
            <p className="text-sm text-gray-600">100 keys, 3 languages</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="font-bold text-gray-900">STARTER</h4>
            <p className="text-3xl font-bold text-gray-900 my-2">$9</p>
            <p className="text-sm text-gray-600">500 keys, 10 languages</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border-2 border-blue-500">
            <h4 className="font-bold text-blue-600">PRO</h4>
            <p className="text-3xl font-bold text-gray-900 my-2">$29</p>
            <p className="text-sm text-gray-600">10K keys, 100+ languages</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="font-bold text-gray-900">ENTERPRISE</h4>
            <p className="text-3xl font-bold text-gray-900 my-2">Custom</p>
            <p className="text-sm text-gray-600">Unlimited everything</p>
          </div>
        </div>
      </section>
    </div>
  )
}
