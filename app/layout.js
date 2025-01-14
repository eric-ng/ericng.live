import { Geist, Geist_Mono } from "next/font/google";
import Nav from '@/components/nav';
import GoogleAdsense from "@/components/googleadsense";
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

const navs = [
  {
    link: '/',
    name: 'Home',
  },
  {
    link: '/porfo',
    name: 'Showcase',
  },
  {
    link: '/about',
    name: 'About',
  },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col h-screen overflow-hidden">
          <Nav navs={navs}/>
          <main className="grow">
            {children}
          </main>
        </div>
      </body>
      <GoogleAdsense pId={`0007369260491705`} />
    </html>
  );
}
