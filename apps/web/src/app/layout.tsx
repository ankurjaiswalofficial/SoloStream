import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import BaseProvider from "@/providers/base-provider";
import Base from "@/components/app/base";
import { Toaster } from "@/components/ui/toaster";
import Analytics from "@/components/analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoloStream",
  description: "SoloStream a (Ankur Jaiswal) production ready application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}`}
      >
        <Analytics measurementId={"G-4ZJL6GP16E"}/>
        <BaseProvider>
          <Base>
            {children}
            <Toaster />
          </Base>
        </BaseProvider>
      </body>
    </html>
  );
}
