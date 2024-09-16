import { PropsWithChildren } from 'react';
import { User } from '@prisma/client';
import {
    json,
    Link,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useFetcher,
    useLoaderData,
    useRouteLoaderData
} from '@remix-run/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import {
    IconButton,
    ThemePanel,
    Theme,
    Button,
    Link as RadixLink,
    Container
} from '@radix-ui/themes';
import { MenuIcon, MoonIcon, SunIcon } from 'lucide-react';

import { Drawer } from './components/Drawer';
import { getUniqueId } from './utils/string';
import { getUser } from './utils/auth.server';
import { Paths } from './utils/constants';
import { useOptionalUser } from './hooks/useOptionalUser';
import DesktopNav from './components/DesktopNav';
import MobileNav from './components/MobileNav';
import useToggle from './hooks/useToggle';
import { getThemeSession } from './utils/theme.server';

import './tailwind.css';
import '@radix-ui/themes/styles.css';

const themePanelOn = process.env.NODE_ENV === 'development';

const getNavLinks = (user: User | undefined) => [
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
];

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

    const navLinksArr = getNavLinks(user).map((linkObj) => ({
        ...linkObj,
        id: getUniqueId('nav-link', 4)
    }));

    return (
        <html lang="en" className={data?.theme}>
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
                <Theme className={`flex flex-col`}>
                    <header className="border-b dark:border-b-zinc-700 px-4 py-4">
                        <nav>
                            <Container>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
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
                                        <DesktopNav links={navLinksArr} />
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
                                            <themeFetcher.Form
                                                method="POST"
                                                action="/api/theme"
                                            >
                                                <IconButton
                                                    name="themeSelection"
                                                    type="submit"
                                                    variant="ghost"
                                                    value={
                                                        isThemeLight
                                                            ? 'dark'
                                                            : 'light'
                                                    }
                                                >
                                                    {isThemeLight ? (
                                                        <MoonIcon />
                                                    ) : (
                                                        <SunIcon />
                                                    )}
                                                </IconButton>
                                            </themeFetcher.Form>
                                        </li>
                                    </ul>
                                </div>
                            </Container>
                        </nav>
                    </header>
                    <main className="flex-1 p-4 bg-zinc-100 dark:bg-zinc-900">
                        {children}
                    </main>
                    <footer className="border-t dark:border-t-zinc-700 px-4 py-8">
                        <Container>Fooooter</Container>
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
                    {themePanelOn && <ThemePanel defaultOpen={false} />}
                </Theme>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const { theme, user } = useLoaderData<typeof loader>();

    return <Outlet context={{ theme, user }} />;
}
