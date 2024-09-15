import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
    return [
        { title: 'TWS Boilerplate' },
        { name: 'description', content: 'Welcome to Remix!' }
    ];
};

export default function Index() {
    return (
        <>
            <h1 className="text-4xl font-bold">Home</h1>
        </>
    );
}
