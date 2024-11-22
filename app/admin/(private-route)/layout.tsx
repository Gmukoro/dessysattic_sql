// app/(private-route)/layout.tsx

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";
import "../../globals.css";

interface Props {
  children: ReactNode;
}

const PrivateLayout: FC<Props> = async ({ children }) => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
};

export default PrivateLayout;
