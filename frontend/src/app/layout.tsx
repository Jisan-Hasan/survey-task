/* eslint-disable @typescript-eslint/ban-ts-comment */
import QueryProvider from "@/providers/query-provider";
import ThemeProvider from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

// @ts-ignore
import "./globals.css";
// @ts-ignore
import "ag-grid-community/styles/ag-grid.css";
// @ts-ignore
import "ag-grid-community/styles/ag-theme-quartz.min.css";

import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-jakarta",
});

export const metadata: Metadata = {
    title: "Survey - By SolShare",
    description:
        "This is an Survey Task provided by SolShare Team, and developed by Jisan Hasan",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${plusJakartaSans.variable}`}>
                <NextTopLoader height={3} showSpinner={false} />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <QueryProvider>{children}</QueryProvider>
                </ThemeProvider>
                <Toaster richColors />
            </body>
        </html>
    );
}
