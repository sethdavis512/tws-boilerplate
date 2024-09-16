import { Dispatch } from 'react';
import { Link as RadixLink } from '@radix-ui/themes';
import { NavLink, useNavigate } from '@remix-run/react';

import { NavLinkType } from './DesktopNav';
import { useOptionalUser } from '~/hooks/useOptionalUser';
import { Paths } from '~/utils/constants';
import { getUniqueId } from '~/utils/string';

export default function MobileNav({
    links,
    toggleDrawer
}: {
    links: NavLinkType[];
    toggleDrawer: Dispatch<boolean>;
}) {
    const user = useOptionalUser();
    const navigate = useNavigate();

    const handleLinkClick = (to: string) => () => {
        toggleDrawer(false);
        navigate(to);
    };

    const allLinks = [
        ...links,
        {
            id: getUniqueId('nav-link', 4),
            end: false,
            show: !user?.id,
            text: 'Login',
            to: Paths.LOGIN
        },
        {
            id: getUniqueId('nav-link', 4),
            end: false,
            show: user?.id,
            text: 'Logout',
            to: Paths.LOGOUT
        }
    ];

    return (
        <ul className="space-y-2">
            {allLinks.map((linkObj) => {
                if (!linkObj.show) {
                    return null;
                }

                return (
                    <li key={linkObj.id}>
                        <RadixLink asChild>
                            <NavLink
                                to={linkObj.to}
                                onClick={handleLinkClick(linkObj.to)}
                            >
                                <span className="block px-4 py-2 hover:bg-zinc-200 hover:dark:bg-zinc-700 rounded-lg">
                                    {linkObj.text}
                                </span>
                            </NavLink>
                        </RadixLink>
                    </li>
                );
            })}
        </ul>
    );
}
