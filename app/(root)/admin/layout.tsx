import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ToasterProvider } from "@/lib/ToasterProvider";
import Providers from "./providers";
import VerificationStatus from "@/components/VerificationStatus";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dessysattic - Admin Dashboard",
  description: "Admin dashboard to manage Dessysattic's data",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <VerificationStatus
            visible={session && !session?.user.verified ? true : false}
          />
          <ToasterProvider />
          {children}
        </Providers>
      </body>
    </html>
  );
}
