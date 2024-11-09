import "../globals.css";

export const metadata = {
  title: "Dessysattic Store",
  description: "Dessysattic store verify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
