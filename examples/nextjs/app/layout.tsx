import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head
        dangerouslySetInnerHTML={{
          __html: `<meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cookie Compliance</title>
        <script>
        var huOptions = {
            "appID": "YOUR_APP_ID",
            "currentLanguage": "en",
            "blocking": true,
            "globalCookie": false
        };
        </script>
        <script src="https://cdn.hu-manity.co/v2/hu-banner.min.js" type="text/javascript" charset="utf-8"></script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>`,
        }}
      />
      <body>
        <header className="topbar">
          <a className="brand" href="/">Cookie Compliance</a>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/product">Product</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p className="footer-name">Field Notes Market</p>
          <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/product">Product</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
