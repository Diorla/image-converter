import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Image Processor - Convert, Compress, and Resize Images Online",
  description:
    "Free online tool to convert, compress, and resize your images. Support for WebP, JPEG, and PNG formats. Easy to use with drag and drop functionality.",
  keywords:
    "image processor, image converter, image compressor, image resizer, WebP, JPEG, PNG, online tool",
  authors: [{ name: "Adeola Adedotun" }],
  openGraph: {
    title: "Image Processor - Convert, Compress, and Resize Images Online",
    description:
      "Free online tool to convert, compress, and resize your images. Support for WebP, JPEG, and PNG formats.",
    url: "https://image-converter.adeolaade.com/",
    siteName: "Image Processor",
    images: [
      {
        url: "https://image-converter.adeolaade.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Image Processor - Convert, Compress, and Resize Images Online",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Image Processor - Convert, Compress, and Resize Images Online",
    description:
      "Free online tool to convert, compress, and resize your images. Support for WebP, JPEG, and PNG formats.",
    images: ["https://image-converter.adeolaade.com/og-image.png"],
    creator: "@dihorla",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
