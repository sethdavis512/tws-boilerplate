import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { requireUserId } from '~/utils/auth.server';

export async function loader({ request }: LoaderFunctionArgs) {
    await requireUserId(request);
    return null;
}

export default function AppLayoutRoute() {
    return (
        <>
            <Outlet />
        </>
    );
}
