import { Container, IconButton, Link as RadixLink } from '@radix-ui/themes';
import { Link, useFetcher, useRouteLoaderData } from '@remix-run/react';
import { MenuIcon, MoonIcon, SunIcon } from 'lucide-react';

import { useOptionalUser } from '~/hooks/useOptionalUser';
import DesktopNav, { NavLinkType } from './DesktopNav';
import { Paths } from '~/utils/constants';

interface HeaderProps {
    links: NavLinkType[];
    toggleDrawer: () => void;
}

export default function Header({ toggleDrawer, links }: HeaderProps) {
    const user = useOptionalUser();
    const themeFetcher = useFetcher();
    const data = useRouteLoaderData<{ theme: 'light' | 'dark' }>('root');
    const isThemeLight = data?.theme === 'light';

    return (
        <header className="border-b dark:border-b-zinc-700 px-4 py-4">
            <nav>
                <Container>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="sm:hidden">
                                <IconButton
                                    onClick={toggleDrawer}
                                    variant="soft"
                                >
                                    <MenuIcon />
                                </IconButton>
                            </div>
                            <RadixLink asChild weight="bold">
                                <Link to={Paths.HOME}>TWS</Link>
                            </RadixLink>
                            <DesktopNav links={links} />
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
                                        value={isThemeLight ? 'dark' : 'light'}
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
    );
}
