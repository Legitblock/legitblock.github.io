import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  title: "LegitBlock — Cryptographic Governance & Document Ratification Blockchain",
  description: "Maintain organizational founding documents, member voting, and complete legal history on an immutable blockchain ledger.",
  keywords: ["blockchain", "corporate governance", "founding documents", "articles of incorporation", "bylaws", "voting", "quorum", "legaltech", "DGCL 224", "cooperatives", "non-profits"]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-5R6T84QP9S"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-5R6T84QP9S');
            `,
          }}
        />
        {/* Anti-FOUT theme bootstrap script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var saved = localStorage.getItem('legitblock_theme');
    var theme = saved || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (['light', 'dark', 'sepia', 'cyber'].indexOf(theme) !== -1) {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark' || theme === 'cyber') {
        document.documentElement.classList.add('dark');
      }
    }
  } catch (e) {}
})();
            `,
          }}
        />
        {/* PWA & Service Worker Registration */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').catch(function(){});
  });
}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
