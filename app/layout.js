import { Geist, Geist_Mono } from "next/font/google";
import Nav from '@/components/nav';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ENG LIVE",
  description: "Live - Eng",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="grid grid-cols-1">
          <Nav />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
