// app/layout.tsx (Root layout)
import { SessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";
import "./globals.css";
import { auth } from "@/auth";

interface Props {
  children: ReactNode;
}

const RootLayout: FC<Props> = async ({ children }) => {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
