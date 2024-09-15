import { Button } from '@radix-ui/themes';
import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { Paths } from '~/utils/constants';

export const meta: MetaFunction = () => {
    return [
        { title: 'TWS Boilerplate' },
        { name: 'description', content: 'Welcome to Remix!' }
    ];
};

export default function Index() {
    return (
        <>
            <Button asChild>
                <Link to={Paths.DASHBOARD}>Dashboard</Link>
            </Button>
        </>
    );
}
