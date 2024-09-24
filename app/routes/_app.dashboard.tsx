import { Container, Heading } from '@radix-ui/themes';
import { Link } from '@remix-run/react';

export default function DashboardRoute() {
    return (
        <Container>
            <Heading as="h1" weight="bold" size="7">
                Dashboard
            </Heading>
            <p>Protected content goes here.</p>
            <Link to="/guarded" className="underline">
                Guarded content
            </Link>
        </Container>
    );
}
