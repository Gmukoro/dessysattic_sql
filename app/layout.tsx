// app/layout.tsx (Root layout)
import { SessionProvider } from "next-auth/react";
import { FC, ReactNode } from "react";
import "./globals.css";

interface Props {
  children: ReactNode;
}

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <head></head>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
