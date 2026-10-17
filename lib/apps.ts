import type { ComponentProps } from 'react';
import type { StaticImageData } from 'next/image';
import type { InfoCard } from 'thread-ui';
import { hasPermission, type Viewer } from './viewer';
// Unsplash License: "Row of books on a shelf" by MIROV (unsplash.com/photos/tpVB6MhG4os)
import booksCover from '@/public/apps/books.jpg';

/** One app on the server that home links to, shown as an InfoCard. */
export type App = {
    /** Stable id, e.g. for React keys */
    id: string;
    name: string;
    url: string;
    /** One line shown under the card */
    description: string;
    /** LLDAP group needed to see (and get into) the app; must match its Authelia rule */
    permission: string;
    /** Phosphor icon name, as thread-ui takes it */
    icon: ComponentProps<typeof InfoCard>['icon'];
    cover: { src: StaticImageData; alt: string };
    /** Optional how-to page, linked under the app's card (so only people who have the app see it) */
    guide?: { title: string; href: string };
};

/** Every app, in display order. Adding an app: one entry here + its Authelia rule + its perm_* group. */
export const APPS: App[] = [
    {
        id: 'books',
        name: 'Books',
        url: 'https://books.fisherandrew.org',
        description: 'Read in the browser or sync with KOReader',
        permission: 'perm_books',
        icon: 'BooksIcon',
        cover: { src: booksCover, alt: 'A row of books on a shelf' },
        guide: { title: 'Set up an e-reader (KOReader)', href: '/guides/books' },
    },
];

/**
 * Looks up an app by id, e.g. for a guide page to check the viewer may see it.
 *
 * @example
 * const books = getApp('books');
 */
export const getApp = (id: string) => APPS.find((app) => app.id === id);

/**
 * The apps this viewer is allowed into.
 *
 * @example
 * const apps = appsFor(viewer);
 */
export const appsFor = (viewer: Viewer) =>
    APPS.filter((app) => hasPermission(viewer, app.permission));
