import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import BaseProvider from "@/providers/base-provider";
import Base from "@/components/app/base";

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
        className={`${inter.className} w-screen h-screen`}
      >
        <BaseProvider>
          <Base>
            {children}
          </Base>
        </BaseProvider>
      </body>
    </html>
  );
}
