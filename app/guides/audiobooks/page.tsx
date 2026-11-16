import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Code, Container, H2, OrderedList, PageHeader, Text } from 'thread-ui';
import { getApp } from '@/lib/apps';
import { getViewer, hasPermission } from '@/lib/viewer';

export const dynamic = 'force-dynamic';

const AUDIOBOOKS_URL = 'https://audiobooks.fisherandrew.org';

/** Heading + content with the same tight gap in every section */
const Section = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-3">
        <H2 marginBottom={false}>{title}</H2>
        {children}
    </section>
);

export default async function AudiobooksGuidePage() {
    const viewer = await getViewer();
    const audiobooks = getApp('audiobooks');

    // Same neutral page Authelia's refusals use, so guessing this URL reveals nothing
    if (!viewer || !audiobooks || !hasPermission(viewer, audiobooks.permission)) {
        redirect('/no-access');
    }

    return (
        <>
            <PageHeader
                title="Listening on your phone"
                description="Stream or download audiobooks, and pick up where you left off"
                center
            />

            <Container>
                <div className="flex flex-col gap-10 pb-12">
                    <Section title="iPhone">
                        <OrderedList
                            items={[
                                'Install ShelfPlayer from the App Store.',
                                <>
                                    Open it and enter the server <Code>{AUDIOBOOKS_URL}</Code>
                                </>,
                                <>
                                    Tap Continue in your browser and log in with your username (
                                    <Code>{viewer.username}</Code>) and your usual password.
                                </>,
                            ]}
                        />
                    </Section>

                    <Section title="Android">
                        <OrderedList
                            items={[
                                'Install Audiobookshelf from Google Play.',
                                <>
                                    Enter the server <Code>{AUDIOBOOKS_URL}</Code>
                                </>,
                                'Tap Login with Authelia and log in the same way.',
                            ]}
                        />
                    </Section>

                    <Section title="Listening offline">
                        <Text>
                            Download a book in the app before a trip or a flight. Your place syncs
                            back the next time you&apos;re online, and carries over to the website
                            too.
                        </Text>
                    </Section>
                </div>
            </Container>
        </>
    );
}

export const metadata: Metadata = {
    title: 'Listening on your phone',
};
