module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  env: {
    node: true,
    jest: false
  },
  ignorePatterns: ['.eslintrc.js', 'prisma/seed.ts', 'dist/**/*'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn'
  }
};
