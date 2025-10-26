/**
 * Flat ESLint config (for ESLint v9+). Keeps Next.js recommended rules
 * and relaxes console rules for scripts.
 */
// eslint.config.cjs - flat config for ESLint v9+.
// Try to reuse `eslint-config-next` when available; otherwise fall back
// to a minimal config so ESLint can run and report issues.
let baseConfigs = [];
try {
  // Try to require the installed shareable config. It may export an object
  // (legacy) or an array (flat). We coerce to an array to spread into the
  // flat config. This keeps the file robust if packages are missing.
   
  const nextConfig = require('eslint-config-next');
  if (Array.isArray(nextConfig)) baseConfigs = nextConfig;
  else if (nextConfig && typeof nextConfig === 'object') baseConfigs = [nextConfig];
} catch (err) {
  // If requiring fails, we'll continue with a minimal fallback config below.
}

const fallback = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['.next/', 'node_modules/'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // Warn on console usage, but allow warn/error/info in source.
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      // Basic React hooks rules (if plugin present they'll be applied; if not,
      // ESLint will ignore unknown rules).
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    // Allow console in tooling and scripts directories and some root scripts
    files: ['scripts/**', 'scripts/**/*', 'utils/**', 'fix_metaname.js', '*.config.js', '*.config.cjs', '*.config.mjs'],
    rules: {
      'no-console': 'off',
    },
  },
];

module.exports = baseConfigs.length ? [...baseConfigs, ...fallback] : fallback;

