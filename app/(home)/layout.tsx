import "@/app/globals.css";
import { Inter as FontSans } from "next/font/google";
import Footer from "@/components/base/Footer";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/base/AuthProvider";
import DifyChatbot from "@/components/base/DifyChatbot";
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
        <AuthProvider>
          <main className="w-full h-screen flex flex-col">
            <Header></Header>
            <div className="flex-grow">{children}</div>
            <Footer></Footer>
          </main>
        </AuthProvider>

        <Toaster />
        <DifyChatbot />
      </body>
    </html>
  );
}
