import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, PageHeader, Text } from 'thread-ui';

/**
 * Where nginx sends people Authelia refused (logged in, but not allowed into that app). Kept vague
 * on purpose: it doesn't name the app or hint that anyone else can open it.
 */
export default function NoAccessPage() {
    return (
        <>
            <PageHeader title="Not available" description="This page isn't available." center />
            <Container as="section">
                <Text align="center">
                    <Link href="/">Back to your apps</Link>
                </Text>
            </Container>
        </>
    );
}

export const metadata: Metadata = {
    title: 'Not available',
};
