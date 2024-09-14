import type { Metadata } from "next";
import "./globals.css";
import { Lato } from 'next/font/google'

const lato = Lato({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Github User search",
  description: "search github users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>
        {children}
      </body>
    </html>
  );
}
