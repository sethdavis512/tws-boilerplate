import { PropsWithChildren } from 'react';
import {
    json,
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration
} from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import {
    IconButton,
    ThemePanel,
    Theme,
    Button,
    Link as RadixLink
} from '@radix-ui/themes';
import { MenuIcon, MoonIcon, SunIcon } from 'lucide-react';

import { Drawer } from './components/Drawer';
import { getUniqueId } from './utils/string';
import { getUser } from './utils/auth.server';
import { Paths } from './utils/constants';
import { useOptionalUser } from './hooks/useOptionalUser';
import DesktopNav from './components/DesktopNav';
import MobileNav from './components/MobileNav';
import useLocalStorage from './hooks/useLocalStorage';
import useToggle from './hooks/useToggle';

import './tailwind.css';
import '@radix-ui/themes/styles.css';

type ThemeClassNameType = 'light' | 'dark';

const STORED_THEME_VALUE = `storedThemeValue`;
const themePanelOn = process.env.NODE_ENV === 'development';

export async function loader({ request }: LoaderFunctionArgs) {
    return json({ user: await getUser(request) });
}

export function Layout({ children }: PropsWithChildren) {
    const [isDrawerOpen, toggleDrawerOpen] = useToggle(false);
    const [themeClassName, setThemeClassName] =
        useLocalStorage<ThemeClassNameType>(STORED_THEME_VALUE, 'light');
    const user = useOptionalUser();

    const navLinksArr = [
        {
            end: true,
            show: true,
            text: 'Home',
            to: Paths.HOME
        },
        {
            end: true,
            show: true,
            text: 'About',
            to: Paths.ABOUT
        },
        {
            end: false,
            show: Boolean(user),
            text: 'Dashboard',
            to: Paths.DASHBOARD
        }
    ].map((linkObj) => ({
        ...linkObj,
        id: getUniqueId('nav-link', 4)
    }));

    const isThemeLight = themeClassName === 'light';

    return (
        <html lang="en" className={themeClassName}>
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
                <Theme appearance="inherit" className={`flex flex-col`}>
                    <header className="border-b dark:border-b-zinc-700 px-4 py-4">
                        <nav className="flex items-center justify-between gap-4">
                            <div className="flex gap-6 items-center">
                                <div className="sm:hidden">
                                    <IconButton
                                        onClick={toggleDrawerOpen}
                                        variant="soft"
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                </div>
                                <RadixLink asChild weight="bold">
                                    <Link to={Paths.HOME}>TWS</Link>
                                </RadixLink>
                                <DesktopNav navLinks={navLinksArr} />
                            </div>
                            <ul className="hidden sm:flex items-center gap-4">
                                {user ? (
                                    <li>
                                        <RadixLink asChild>
                                            <Link
                                                to={Paths.LOGOUT}
                                                className="underline"
                                            >
                                                Logout
                                            </Link>
                                        </RadixLink>
                                    </li>
                                ) : (
                                    <li>
                                        <RadixLink asChild>
                                            <Link
                                                to={Paths.LOGIN}
                                                className="underline"
                                            >
                                                Login
                                            </Link>
                                        </RadixLink>
                                    </li>
                                )}
                                <li>
                                    <IconButton
                                        variant="ghost"
                                        onClick={() =>
                                            setThemeClassName(
                                                isThemeLight ? 'dark' : 'light'
                                            )
                                        }
                                    >
                                        {isThemeLight ? (
                                            <MoonIcon />
                                        ) : (
                                            <SunIcon />
                                        )}
                                    </IconButton>
                                </li>
                            </ul>
                        </nav>
                    </header>
                    <main className="flex-1 p-4 bg-zinc-100 dark:bg-zinc-900">
                        {children}
                    </main>
                    <footer className="border-t dark:border-t-zinc-700 px-4 py-8">
                        Fooooter
                    </footer>
                    <Drawer
                        id="mobileNav"
                        isOpen={isDrawerOpen}
                        handleClose={toggleDrawerOpen}
                        containerClassName={`p-0 flex flex-col justify-between`}
                    >
                        <div className="p-4">
                            <MobileNav
                                navLinks={navLinksArr}
                                toggleDrawer={toggleDrawerOpen}
                            />
                        </div>
                        <div className="p-4 border-t dark:border-t-zinc-700">
                            <Button
                                className="flex gap-2"
                                variant="soft"
                                onClick={() =>
                                    setThemeClassName(
                                        isThemeLight ? 'dark' : 'light'
                                    )
                                }
                            >
                                {isThemeLight ? <MoonIcon /> : <SunIcon />}
                                <span className="block">
                                    {`Change to ${
                                        isThemeLight ? 'dark' : 'light'
                                    } mode`}
                                </span>
                            </Button>
                        </div>
                    </Drawer>
                    {themePanelOn && <ThemePanel defaultOpen={false} />}
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
