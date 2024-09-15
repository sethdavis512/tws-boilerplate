import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader() {
    return json({ count: 1 });
}

export async function action() {
    // const form = await request.formData();
    return null;
}

export default function DashboardRoute() {
    const { count } = useLoaderData<typeof loader>();

    return <>Dashboard --- {count}</>;
}
