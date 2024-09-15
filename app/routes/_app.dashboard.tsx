import { Container, Heading } from '@radix-ui/themes';

export default function DashboardRoute() {
    return (
        <Container>
            <Heading as="h1" className="text-4xl font-bold">
                Dashboard
            </Heading>
        </Container>
    );
}
