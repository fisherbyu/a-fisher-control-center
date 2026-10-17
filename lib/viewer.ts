import 'server-only';
import { headers } from 'next/headers';

/** The person viewing the page, as Authelia identified them. */
export type Viewer = {
    username: string;
    name: string;
    email: string;
    /** LLDAP groups, e.g. `perm_books`, `perm_admin` */
    groups: string[];
};

/**
 * In `next dev` there's no Authelia in front, so a missing header falls back to a DEV_REMOTE_*
 * variable from .env.local. Never in production: there, only nginx's headers count.
 */
const devFallback = (name: string) =>
    process.env.NODE_ENV === 'production' ? undefined : process.env[`DEV_REMOTE_${name}`];

/**
 * Reads who's logged in from the Remote-* headers nginx sets from Authelia's answer. They're only
 * trustworthy because nginx always overwrites them and only nginx can reach this app.
 * Returns `null` when there's no user, which behind Authelia means something is misconfigured.
 *
 * @example
 * const viewer = await getViewer();
 * if (viewer) { ... }
 */
export const getViewer = async (): Promise<Viewer | null> => {
    const h = await headers();
    const read = (name: string) => h.get(`remote-${name.toLowerCase()}`) || devFallback(name) || '';

    const username = read('USER');
    if (!username) return null;

    return {
        username,
        name: read('NAME') || username,
        email: read('EMAIL'),
        groups: read('GROUPS')
            .split(',')
            .map((group) => group.trim())
            .filter(Boolean),
    };
};

/**
 * Whether the viewer is in an LLDAP permission group.
 *
 * @example
 * if (hasPermission(viewer, 'perm_books')) { ... }
 */
export const hasPermission = (viewer: Viewer, permission: string) =>
    viewer.groups.includes(permission);
