//app\(guest-route)\layout.tsx
// "use client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";
import "../globals.css";

interface Props {
  children: ReactNode;
}

const GuestLayout: FC<Props> = ({ children }) => {
  // const session = await auth();

  // if (session) return redirect("/");
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default GuestLayout;
