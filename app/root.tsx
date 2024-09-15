import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import {
    Theme
    // ThemePanel
} from '@radix-ui/themes';

import './tailwind.css';
import '@radix-ui/themes/styles.css';

export const links: LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <Theme appearance="dark">
                    {children}
                    {/* <ThemePanel /> */}
                </Theme>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}
