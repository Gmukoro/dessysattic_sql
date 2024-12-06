//app\(guest-route)\layout.tsx

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";
import "../globals.css";

interface Props {
  children: ReactNode;
}

const GuestLayout: FC<Props> = async ({ children }) => {
  const session = await auth();

  if (session) return redirect("/");

  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
};

export default GuestLayout;
