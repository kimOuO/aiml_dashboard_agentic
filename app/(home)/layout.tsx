import "@/app/globals.css";
import { Inter as FontSans } from "next/font/google";
import Footer from "@/components/base/Footer";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

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
          <div className="flex-grow p-6">{children}</div>
          <Footer></Footer>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
