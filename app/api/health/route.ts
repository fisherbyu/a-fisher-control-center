export const dynamic = 'force-dynamic';

/**
 * Health check for deploy.sh, which calls it from inside nginx (not through Authelia) before
 * switching traffic to a new slot. Only says the server is up; never cached.
 */
export const GET = () =>
    Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
