import "@/app/globals.css";
import { Inter as FontSans } from "next/font/google";
import Footer from "@/components/base/Footer";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
import Header from "@/components/base/Header";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <main className="w-full h-screen flex flex-col">
          <Header></Header>
          {children}
          <Footer></Footer>
        </main>
      </body>
    </html>
  );
}
