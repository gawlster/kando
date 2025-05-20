import clsx from "clsx";
import { Head, Html, Main, NextScript } from "next/document";
import { fonts } from "./_app";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="manifest" href="manifest.json"></link>
            </Head>
            <body
                className={clsx(
                    "min-h-screen bg-background font-sans antialiased",
                    fonts.main.className
                )}
            >
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
