import Image from 'next/image';
import Link from 'next/link';
import { Card, ColumnLayout, Container, InfoCard, PageHeader, Text } from 'thread-ui';
import { appsFor } from '@/lib/apps';
import { getViewer } from '@/lib/viewer';

// Each person sees their own page, read from Authelia's headers on every request
export const dynamic = 'force-dynamic';

const AUTH_URL = 'https://auth.fisherandrew.org';

const ACCOUNT_LINKS = [
    {
        key: 'settings',
        title: 'Password & 2FA',
        text: 'Change your password or set up two-factor login',
        url: `${AUTH_URL}/settings`,
    },
    { key: 'logout', title: 'Log out', text: 'Sign out of every app', url: `${AUTH_URL}/logout` },
];

export default async function Home() {
    const viewer = await getViewer();

    // Behind Authelia there's always a user; no user means the proxy isn't passing headers
    if (!viewer) {
        return (
            <PageHeader
                title="Something's not right"
                description="Couldn't tell who you are. Let Andrew know."
                center
            />
        );
    }

    const apps = appsFor(viewer);

    return (
        <>
            <PageHeader title={`Hi ${viewer.name}`} center />

            {apps.length > 0 ? (
                <ColumnLayout
                    title="Applications"
                    mdcol={2}
                    lgcol={3}
                    items={apps.map((app) => ({
                        key: app.id,
                        content: (
                            <div className="flex flex-col gap-2">
                                <InfoCard
                                    title={app.name}
                                    url={app.url}
                                    icon={app.icon}
                                    image={<Image src={app.cover.src} alt={app.cover.alt} />}
                                />
                                <Text size="sm">{app.description}</Text>
                                {/* Only on apps this viewer has, so it never hints at others */}
                                {app.guide && (
                                    <Text size="sm">
                                        <Link href={app.guide.href}>{app.guide.title}</Link>
                                    </Text>
                                )}
                            </div>
                        ),
                    }))}
                />
            ) : (
                <Container as="section">
                    <Text align="center">No apps yet. Ask Andrew for access.</Text>
                </Container>
            )}

            <ColumnLayout
                title="Your account"
                mdcol={2}
                lgcol={3}
                items={ACCOUNT_LINKS.map((link) => ({
                    key: link.key,
                    content: (
                        <a href={link.url} className="block no-underline">
                            <Card title={{ text: link.title }} fullWidth>
                                <Text>{link.text}</Text>
                            </Card>
                        </a>
                    ),
                }))}
            />
        </>
    );
}
