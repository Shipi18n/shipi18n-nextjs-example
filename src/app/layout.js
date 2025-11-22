import './globals.css'

export const metadata = {
  title: 'Shipi18n Next.js Example',
  description: 'Example Next.js application demonstrating Shipi18n API integration',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold">Shipi18n + Next.js</h1>
            <p className="mt-2 text-blue-100">
              Translate your app to 100+ languages with a single API call
            </p>
          </div>
        </header>
        <main className="max-w-6xl mx-auto py-8 px-4">
          {children}
        </main>
        <footer className="bg-gray-100 py-6 px-4 mt-auto">
          <div className="max-w-6xl mx-auto text-center text-gray-600">
            <p>
              Built with{' '}
              <a href="https://shipi18n.com" className="text-blue-600 hover:underline">
                Shipi18n
              </a>
              {' '}&mdash;{' '}
              <a href="https://github.com/Shipi18n/shipi18n-nextjs-example" className="text-blue-600 hover:underline">
                View on GitHub
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
