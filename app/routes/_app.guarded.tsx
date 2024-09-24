import { Container, Heading } from '@radix-ui/themes';
import { Link } from '@remix-run/react';
import { Paths } from '~/utils/constants';

export default function GuardedRoute() {
    return (
        <Container>
            <Heading as="h1" weight="bold" size="7">
                Guarded
            </Heading>
            <p>Your content is safe on this page too!</p>
            <Link to={Paths.DASHBOARD} className="underline">
                Back to Dashboard
            </Link>
        </Container>
    );
}
