import { AspectRatio, Container, Heading } from '@radix-ui/themes';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
    return [
        { title: 'TWS Boilerplate' },
        { name: 'description', content: 'Welcome to Remix!' }
    ];
};

export default function Index() {
    return (
        <Container>
            <AspectRatio ratio={16 / 8} className="mb-8">
                <img
                    src="https://images.unsplash.com/photo-1479030160180-b1860951d696?&auto=format&fit=crop&w=1200&q=80"
                    alt="A house in a forest"
                    style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        borderRadius: 'var(--radius-2)'
                    }}
                />
            </AspectRatio>
            <Heading as="h1" weight="bold" size="7">
                Welcome
            </Heading>
        </Container>
    );
}
