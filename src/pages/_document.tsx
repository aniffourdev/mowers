import { Html, Head, Main, NextScript } from 'next/document';
import fs from 'fs';
import path from 'path';

export default function Document() {
  // Read critical CSS
  const criticalCss = fs.readFileSync(
    path.join(process.cwd(), 'src/styles/critical.css'),
    'utf8'
  );

  return (
    <Html lang="en">
      <Head>
        {/* Inline critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
        
        {/* Preload main CSS */}
        <link
          rel="preload"
          href="/_next/static/css/styles.css"
          as="style"
          onLoad={() => {
            const link = document.querySelector('link[rel="preload"]');
            if (link) {
              link.setAttribute('rel', 'stylesheet');
            }
          }}
        />
        <noscript>
          <link rel="stylesheet" href="/_next/static/css/styles.css" />
        </noscript>

        {/* Preconnect to image domains */}
        <link rel="preconnect" href="https://www.gvr.ltm.temporary.site" />
        
        {/* DNS prefetch for image domains */}
        <link rel="dns-prefetch" href="https://www.gvr.ltm.temporary.site" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 