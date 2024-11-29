// app(guest-route)/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FC, ReactNode, useEffect } from "react";
import "../globals.css";

interface Props {
  children: ReactNode;
}

const GuestLayout: FC<Props> = ({ children }) => {
  const { data: session, status } = useSession();

  // Ensure that you are only running this logic on the client-side
  useEffect(() => {
    if (session) {
      console.log("Session exists, redirecting to root.");
      redirect("/");
      window.location.reload();
    }
  }, [session]);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default GuestLayout;
