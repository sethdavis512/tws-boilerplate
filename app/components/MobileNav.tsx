import { Dispatch } from 'react';
import { Link as RadixLink } from '@radix-ui/themes';
import { NavLink, useNavigate } from '@remix-run/react';

import { NavLinkType } from './DesktopNav';

export default function MobileNav({
    navLinks,
    toggleDrawer
}: {
    navLinks: NavLinkType[];
    toggleDrawer: Dispatch<boolean>;
}) {
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
}
