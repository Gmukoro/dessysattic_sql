import { Inter } from "next/font/google";
import "../globals.css";
import { ToasterProvider } from "@/lib/ToasterProvider";
import Providers from "./providers";
import VerificationStatus from "@/components/VerificationStatus";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dessysattic - Admin Dashboard",
  description: "Admin dashboard to manage Dessysattic's data",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  // If no session or user is not an admin, redirect to home
  if (!session || session.user.role !== "admin") {
    // Redirect to home page
    return (
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <ToasterProvider />
            <script>
              {`
                window.location.href = "/";
                alert("You are not authorized to access this page.");
              `}
            </script>
          </Providers>
        </body>
      </html>
    );
  }

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
