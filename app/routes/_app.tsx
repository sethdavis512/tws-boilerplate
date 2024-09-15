import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { getUserId } from '~/utils/auth.server';
import { Paths } from '~/utils/constants';

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await getUserId(request);

    if (!userId) {
        return redirect(Paths.LOGIN);
    }

    return null;
}

export default function AppLayoutRoute() {
    return (
        <div className="bg-zinc-100">
            <Outlet />
        </div>
    );
}
