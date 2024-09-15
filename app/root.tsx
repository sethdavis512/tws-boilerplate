import { useState } from 'react';
import {
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import { IconButton, Theme, ThemePanel } from '@radix-ui/themes';

import './tailwind.css';
import '@radix-ui/themes/styles.css';
import { Paths } from './utils/constants';
import { MenuIcon } from 'lucide-react';
import { Drawer } from './components/Drawer';

const themePanelOn = process.env.NODE_ENV === 'development';

export const links: LinksFunction = () => [];

export function Layout({ children }: { children: React.ReactNode }) {
    const [isDrawerOpen, setDrawerState] = useState(false);
    const handleMobileNavState = () => {
        setDrawerState(!isDrawerOpen);
    };

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
                <Theme appearance="dark" className="flex flex-col">
                    <header className="border-b dark:border-b-zinc-700 px-4 py-4">
                        <nav className="flex items-center gap-4">
                            <IconButton onClick={handleMobileNavState}>
                                <MenuIcon />
                            </IconButton>
                            <ul>
                                <li>
                                    <Link to={Paths.HOME} className="font-bold">
                                        TWS
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </header>
                    <main className="flex-1 p-4">{children}</main>
                    <footer className="border-t dark:border-t-zinc-700 px-4 py-8">
                        Fooooter
                    </footer>
                    {themePanelOn && <ThemePanel />}
                    <Drawer
                        id="mobileNav"
                        isOpen={isDrawerOpen}
                        handleClose={handleMobileNavState}
                    >
                        Hey there
                    </Drawer>
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
