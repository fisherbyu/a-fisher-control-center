import '@/public/styles/globals.css';
import 'thread-ui/thread.css';
import { ThreadTheme, ThreadScript, Footer, NavMenu } from 'thread-ui';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Noto_Sans, Libre_Baskerville, Victor_Mono } from 'next/font/google';
import Link from 'next/link';
import { AFLogo } from '@/components';
import { AndrewFisherLogo } from '@/components';

const heading = Libre_Baskerville({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-heading',
});

const body = Noto_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-body',
});

const mono = Victor_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-mono',
});

const fontVariables = `${heading.variable} ${body.variable} ${mono.variable}`;

export let metadata: Metadata = {
    title: 'Andrew Fisher',
    description: 'Created by Andrew Fisher',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={fontVariables} suppressHydrationWarning>
            <head>
                <ThreadScript defaultMode="system" />
            </head>
            <body style={{ backgroundColor: ThreadTheme.surface }}>
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        {/* <NavMenu logo={{ href: '/', logo: <AFLogo /> }} items={[]} /> */}
                        <main className="flex-grow pt-10">{children}</main>
                        <Footer
                            bg="surface"
                            description="Created By Andrew Fisher"
                            logo={
                                <Link href="/">
                                    <AFLogo />
                                </Link>
                            }
                            githubLink="https://github.com/fisherbyu"
                            linkedInLink="https://www.linkedin.com/in/fisherandrew777/"
                        />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
