import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NEAR Domains",
  description: "Created by MoAgr",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Link
          href={{
            pathname: "/",
          }}
          className="border rounded px-3 py-2 text-purple"
        >
          Home
        </Link>
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h1 className="text-3xl font-semibold mb-4">NEAR Domains</h1>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
