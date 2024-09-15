import { NavLink } from '@remix-run/react';
import { Link as RadixLink } from '@radix-ui/themes';

import { Paths } from '~/utils/constants';

export interface NavLinkType {
    id: string;
    end: boolean;
    show: boolean;
    text: string;
    to: Paths;
}

interface DesktopNavProps {
    links: NavLinkType[];
}

export default function DesktopNav({ links }: DesktopNavProps) {
    return (
        <ul className="hidden sm:flex sm:gap-4 sm:items-center">
            {links.map((linkObj) => {
                if (!linkObj.show) {
                    return null;
                }

                return (
                    <li key={linkObj.id}>
                        <RadixLink asChild>
                            <NavLink to={linkObj.to}>{linkObj.text}</NavLink>
                        </RadixLink>
                    </li>
                );
            })}
        </ul>
    );
}
