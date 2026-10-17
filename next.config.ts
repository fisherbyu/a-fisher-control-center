import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Bundles only what the server needs, for a small Docker image
    output: 'standalone',
    // Don't generate AGENTS.md / CLAUDE.md on next dev
    agentRules: false,
};

export default nextConfig;
