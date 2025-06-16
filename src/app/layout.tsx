import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/providers/auth-provider";
import ReactQueryProvider from "@/providers/react-query-provider";
import "react-day-picker/style.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saltbay Lounge",
  description:
    "Nestled along the golden shores of Mount Lavinia, Colombia's iconic beachfront, Sahbay Lounge redefines coastal luxury. Founded in 2010, our hotel blends Sri Lanka's rich hospitality traditions with contemporary design, offering a serene escape just 12 km from Colombo's bustling city center.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-min`}
        >
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}

              <Toaster position="top-right" />
            </ThemeProvider>
          </ReactQueryProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
