import type { AppProps } from "next/app";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import "@/styles/globals.css";
import { Roboto_Condensed } from "next/font/google"

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    return (
        <HeroUIProvider navigate={router.push}>
            <NextThemesProvider>
                <Component {...pageProps} />
            </NextThemesProvider>
        </HeroUIProvider>
    );
}

const robotoCondensed = Roboto_Condensed({
    subsets: ["latin"],
    variable: "--font-roboto-condensed",
});

export const fonts = {
    main: robotoCondensed,
};
