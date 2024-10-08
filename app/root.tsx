import { PropsWithChildren } from 'react';
import { User } from '@prisma/client';
import {
    json,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useFetcher,
    useRouteLoaderData
} from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import {
    ThemePanel,
    Theme,
    Button,
    Container,
    Link as RadixLink
} from '@radix-ui/themes';
import { MoonIcon, SunIcon } from 'lucide-react';

import { Drawer } from './components/Drawer';
import { getThemeSession } from './utils/theme.server';
import { getUniqueId } from './utils/string';
import { getUser } from './utils/auth.server';
import { NavLinkType } from './components/DesktopNav';
import { Paths } from './utils/constants';
import { useOptionalUser } from './hooks/useOptionalUser';
import Header from './components/Header';
import MobileNav from './components/MobileNav';
import useToggle from './hooks/useToggle';

import './tailwind.css';
import '@radix-ui/themes/styles.css';

const themePanelEnabled = process.env.NODE_ENV === 'development';

const getNavLinks = (user: User | undefined): NavLinkType[] =>
    [
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

export async function loader({ request }: LoaderFunctionArgs) {
    const themeSession = await getThemeSession(request);

    return json({
        user: await getUser(request),
        theme: themeSession.getTheme()
    });
}

export function Layout({ children }: PropsWithChildren) {
    const themeFetcher = useFetcher();
    const [isDrawerOpen, toggleDrawerOpen] = useToggle(false);
    const user = useOptionalUser();
    const data = useRouteLoaderData<{ theme: 'light' | 'dark' }>('root');

    const isThemeLight = data?.theme === 'light';

    const navLinksArr = getNavLinks(user);

    return (
        <html lang="en" className={`${data?.theme} bg-zinc-700`}>
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
                <Theme accentColor="jade" className="flex flex-col">
                    <Header
                        links={getNavLinks(user)}
                        toggleDrawer={toggleDrawerOpen}
                    />
                    <main className="flex-1 p-4 bg-zinc-200 dark:bg-zinc-900">
                        {children}
                    </main>
                    <footer className="border-t border-t-zinc-300 dark:border-t-zinc-700 px-4 py-8">
                        <Container>
                            Created by{' '}
                            <RadixLink href="https://twitter.com/sethdavis512">
                                @sethdavis512
                            </RadixLink>
                        </Container>
                    </footer>
                    <Drawer
                        id="mobileNav"
                        isOpen={isDrawerOpen}
                        handleClose={toggleDrawerOpen}
                        containerClassName={`p-0 flex flex-col justify-between`}
                    >
                        <div className="p-4">
                            <MobileNav
                                links={navLinksArr}
                                toggleDrawer={toggleDrawerOpen}
                            />
                        </div>
                        <div className="p-4 border-t dark:border-t-zinc-700">
                            <themeFetcher.Form
                                method="POST"
                                action="/api/theme"
                            >
                                <Button
                                    className="flex gap-2"
                                    variant="soft"
                                    name="themeSelection"
                                    value={isThemeLight ? 'dark' : 'light'}
                                >
                                    {isThemeLight ? <MoonIcon /> : <SunIcon />}
                                    <span className="block">
                                        {`Change to ${
                                            isThemeLight ? 'dark' : 'light'
                                        } mode`}
                                    </span>
                                </Button>
                            </themeFetcher.Form>
                        </div>
                    </Drawer>
                    {themePanelEnabled && <ThemePanel defaultOpen={false} />}
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
