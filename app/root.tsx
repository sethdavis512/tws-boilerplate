import { Dispatch, PropsWithChildren, useState } from 'react';
import {
    json,
    Link,
    Links,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useNavigate
} from '@remix-run/react';
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node';
import {
    IconButton,
    ThemePanel,
    Theme,
    Button,
    Link as RadixLink
} from '@radix-ui/themes';

import { Paths } from './utils/constants';
import { MenuIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Drawer } from './components/Drawer';
import { getUniqueId } from './utils/string';
import useToggle from './hooks/useToggle';

import './tailwind.css';
import '@radix-ui/themes/styles.css';
import { getUser } from './utils/auth.server';
import { useOptionalUser } from './hooks/useOptionalUser';

interface NavLinkType {
    id: string;
    end: boolean;
    show: boolean;
    text: string;
    to: Paths | string;
}

const themePanelOn = process.env.NODE_ENV === 'development';

export const links: LinksFunction = () => [];

const DesktopNav = ({ navLinks }: { navLinks: NavLinkType[] }) => (
    <ul className="hidden sm:flex sm:gap-4 sm:items-center">
        {navLinks.map((linkObj) => (
            <li key={linkObj.id}>
                <RadixLink asChild>
                    <NavLink to={linkObj.to}>{linkObj.text}</NavLink>
                </RadixLink>
            </li>
        ))}
    </ul>
);

const MobileNav = ({
    navLinks,
    toggleDrawer
}: {
    navLinks: NavLinkType[];
    toggleDrawer: Dispatch<boolean>;
}) => {
    const navigate = useNavigate();

    const handleLinkClick = (to: string) => () => {
        toggleDrawer(false);
        navigate(to);
    };

    return (
        <ul className="space-y-2">
            {navLinks.map((linkObj) => (
                <li key={linkObj.id}>
                    <RadixLink asChild>
                        <NavLink
                            to={linkObj.to}
                            onClick={handleLinkClick(linkObj.to)}
                        >
                            {linkObj.text}
                        </NavLink>
                    </RadixLink>
                </li>
            ))}
        </ul>
    );
};

type ThemeClassNameType = 'light' | 'dark';

export async function loader({ request }: LoaderFunctionArgs) {
    return json({ user: await getUser(request) });
}

export function Layout({ children }: PropsWithChildren) {
    const [isDrawerOpen, toggleDrawerOpen] = useToggle(false);
    const [themeClassName, setThemeClassName] =
        useState<ThemeClassNameType>('light');
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
                                {user && (
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
