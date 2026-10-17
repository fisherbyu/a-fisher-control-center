import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Code, Container, H2, OrderedList, PageHeader, Text } from 'thread-ui';
import { getApp } from '@/lib/apps';
import { getViewer, hasPermission } from '@/lib/viewer';

export const dynamic = 'force-dynamic';

const BOOKS_URL = 'https://books.fisherandrew.org';

/** Heading + content with the same tight gap in every section */
const Section = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="flex flex-col gap-3">
        <H2 marginBottom={false}>{title}</H2>
        {children}
    </section>
);

export default async function BooksGuidePage() {
    const viewer = await getViewer();
    const books = getApp('books');

    // Same neutral page Authelia's refusals use, so guessing this URL reveals nothing
    if (!viewer || !books || !hasPermission(viewer, books.permission)) redirect('/no-access');

    return (
        <>
            <PageHeader
                title="Reading on an e-reader"
                description="Download books and sync your progress with KOReader"
                center
            />

            <Container>
                <div className="flex flex-col gap-10 pb-12">
                    <Section title="Add the library">
                        <OrderedList
                            items={[
                                'In KOReader, open the top menu, tap the search icon, then OPDS catalog.',
                                <>
                                    Tap + and enter the catalog URL{' '}
                                    <Code>{`${BOOKS_URL}/opds`}</Code>
                                </>,
                                <>
                                    Use your username (<Code>{viewer.username}</Code>) and your
                                    usual password.
                                </>,
                                'Open the catalog, pick a book and tap Download.',
                            ]}
                        />
                    </Section>

                    <Section title="Sync your reading progress">
                        <OrderedList
                            items={[
                                <>
                                    Download the{' '}
                                    <a href={`${BOOKS_URL}/static/koplugin.zip`}>sync plugin</a>.
                                </>,
                                <>
                                    Unzip it into KOReader&apos;s <Code>plugins</Code> folder, so
                                    you have <Code>plugins/cwasync.koplugin</Code>, then restart
                                    KOReader.
                                </>,
                                <>
                                    Open CWA Sync from the tools menu and set the server to{' '}
                                    <Code>{`${BOOKS_URL}/kosync`}</Code>, with the same username and
                                    password.
                                </>,
                            ]}
                        />
                    </Section>

                    <Section title="If you change your password">
                        <Text>
                            Update it in KOReader too, in both the catalog and CWA Sync. KOReader
                            keeps trying the old one, and too many wrong tries lock your account for
                            a few minutes.
                        </Text>
                    </Section>
                </div>
            </Container>
        </>
    );
}

export const metadata: Metadata = {
    title: 'Reading on an e-reader',
};
