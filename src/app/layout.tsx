import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import Toast from "@/components/Toast";
import Stepper from "@/components/Stepper/Stepper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mejora tu CV con IA",
  description:
    "Analiza y mejora tu CV o perfila candidatos ideales para tus vacantes utilizando inteligencia artificial",
  icons: {
    icon: "/main-icon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className={styles.layoutContainer}>
          <div className={styles.advertisementColumn}>
            <div className={styles.advertisementSpace}></div>
          </div>

          <div className={styles.mainContentWrapper}>
            <Stepper />
            {children}
          </div>

          <div className={styles.advertisementColumn}>
            <div className={styles.advertisementSpace}></div>
          </div>
        </div>
        <Toast />
      </body>
    </html>
  );
}
