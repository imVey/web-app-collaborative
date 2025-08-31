import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta
          name="description"
          content="Plateforme collaborative en temps réel avec Next.js, Socket.io et PostgreSQL"
        />
        <meta
          name="keywords"
          content="collaboration, temps réel, Next.js, Socket.io, PostgreSQL"
        />
        <meta name="author" content="Web App Collaborative" />
        <link rel="icon" href="/favicon.ico" />

        {/* Préchargement des polices */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Meta pour PWA */}
        <meta name="theme-color" content="#06d6a0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
