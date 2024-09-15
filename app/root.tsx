import { Dispatch, PropsWithChildren, useState } from 'react';
import {
    Links,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
    useNavigate
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import { IconButton, ThemePanel, Theme, Button } from '@radix-ui/themes';

import { Paths } from './utils/constants';
import { MenuIcon, MoonIcon, SunIcon } from 'lucide-react';
import { Drawer } from './components/Drawer';
import { getUniqueId } from './utils/string';
import useToggle from './hooks/useToggle';

import './tailwind.css';
import '@radix-ui/themes/styles.css';

const themePanelOn = process.env.NODE_ENV === 'development';

export const links: LinksFunction = () => [];

const navLinksArr = [
    {
        end: true,
        isDesktop: true,
        isMobile: true,
        text: 'Home',
        to: Paths.HOME
    },
    {
        end: false,
        isDesktop: true,
        isMobile: true,
        text: 'Dashboard',
        to: Paths.DASHBOARD
    }
].map((linkObj) => ({
    ...linkObj,
    id: getUniqueId('nav-link', 4)
}));

const DesktopNav = ({
    themeClassName,
    toggleTheme
}: {
    themeClassName: ThemeClassNameType;
    toggleTheme: (t: ThemeClassNameType) => void;
}) => (
    <div className="hidden sm:flex sm:justify-between">
        <ul className="flex gap-4 sm:items-center">
            {navLinksArr.map((linkObj) => (
                <li key={linkObj.id}>
                    <NavLink to={linkObj.to}>{linkObj.text}</NavLink>
                </li>
            ))}
        </ul>
        <ul>
            <li>
                <IconButton
                    variant="ghost"
                    onClick={() =>
                        toggleTheme(
                            themeClassName === 'light' ? 'dark' : 'light'
                        )
                    }
                >
                    {themeClassName === 'light' ? <MoonIcon /> : <SunIcon />}
                </IconButton>
            </li>
        </ul>
    </div>
);

const MobileNav = ({ toggleDrawer }: { toggleDrawer: Dispatch<boolean> }) => {
    const navigate = useNavigate();

    const handleLinkClick = (to: string) => () => {
        toggleDrawer(false);
        navigate(to);
    };

    return (
        <ul className="space-y-2">
            {navLinksArr.map((linkObj) => (
                <li key={linkObj.id}>
                    <NavLink
                        to={linkObj.to}
                        className={({ isActive }) =>
                            `rounded-lg block p-3 ${
                                isActive ? 'bg-zinc-200 dark:bg-zinc-700' : ''
                            }`
                        }
                        onClick={handleLinkClick(linkObj.to)}
                        end={linkObj.end}
                    >
                        {linkObj.text}
                    </NavLink>
                </li>
            ))}
        </ul>
    );
};

type ThemeClassNameType = 'light' | 'dark';

export function Layout({ children }: PropsWithChildren) {
    const [isDrawerOpen, toggleDrawerOpen] = useToggle(false);
    const [themeClassName, setThemeClassName] =
        useState<ThemeClassNameType>('light');

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
                <Theme
                    appearance="inherit"
                    className={`${themeClassName} flex flex-col`}
                >
                    <header className="border-b dark:border-b-zinc-700 px-4 py-4">
                        <nav className="flex items-center w-full gap-4">
                            <div className="sm:hidden">
                                <IconButton onClick={toggleDrawerOpen}>
                                    <MenuIcon />
                                </IconButton>
                            </div>
                            <DesktopNav
                                themeClassName={themeClassName}
                                toggleTheme={setThemeClassName}
                            />
                        </nav>
                    </header>
                    <main className="flex-1 p-4">{children}</main>
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
                            <MobileNav toggleDrawer={toggleDrawerOpen} />
                        </div>
                        <div className="px-6 py-4 border-t dark:border-t-zinc-700">
                            <Button
                                className="flex gap-2"
                                variant="ghost"
                                onClick={() =>
                                    setThemeClassName(
                                        themeClassName === 'light'
                                            ? 'dark'
                                            : 'light'
                                    )
                                }
                            >
                                {themeClassName === 'light' ? (
                                    <MoonIcon />
                                ) : (
                                    <SunIcon />
                                )}
                                <span className="block">
                                    {`Change to ${
                                        themeClassName === 'light'
                                            ? 'dark'
                                            : 'light'
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
