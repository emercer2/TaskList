import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";
import { ThemeProvider } from "./context/ThemeContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Built with Next.js",
};

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t && ['blue','purple','green','rose','amber'].includes(t)) {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <footer className="bg-white/50 border-t border-accent-100 py-4 text-center text-gray-500 text-sm">
            © 2024 TaskApp
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
