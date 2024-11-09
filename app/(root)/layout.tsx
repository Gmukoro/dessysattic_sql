import { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider, useSession } from "next-auth/react";

import "../globals.css";
import Navbar from "@/components/Navbartt";
import ToasterProvider from "@/lib/providers/ToasterProvider";
import Footer from "@/components/Footer";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import { CurrencyProvider } from "@/lib/context/currencyContext";
import Providers from "./providers";
import VerificationStatus from "@/components/VerificationStatus";
import { auth } from "@/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DSY Store",
  description: "DSY Ecommerce Store",
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <SessionProvider session={await auth()}>
            <SessionContent>{children}</SessionContent>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
};

const SessionContent = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <>
      <VerificationStatus visible={!!session && !session.user.verified} />
      <ToasterProvider />
      <CurrencyProvider>
        <Navbar />
        {children}
        <NewsletterSubscription />
        <Footer />
      </CurrencyProvider>
    </>
  );
};

export default RootLayout;
