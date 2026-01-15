module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'babel-plugin-transform-vite-meta-env',
      {
        env: {
          VITE_SME_CDEP_API: process.env.VITE_SME_CDEP_API || 'http://localhost:3000',
          VITE_SME_CDEP_AUTH:
            process.env.VITE_SME_CDEP_AUTH || 'http://localhost:3000/auth',
        },
      },
    ],
  ],
};
