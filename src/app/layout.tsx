import type { Metadata } from "next";
import "./assets/css/header.css";
import "./assets/css/footer.css";
import Header from "./components/header";
import Footer from "./components/footer";
import "bootstrap/dist/css/bootstrap.min.css";
export const metadata: Metadata = {
  title: "Fantastic Fare",
  description: "Tours and travels",
 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.png" sizes="16x16 24x24 32x32 48x48 64x64 128x128 256x256" type="image/x-icon"/>

<link rel="icon" href="/favicon.svg" type="image/svg+xml"/>

<link rel="apple-touch-icon" href="/apple-touch-icon.png"/>

<link rel="manifest" href="/site.webmanifest"/>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
