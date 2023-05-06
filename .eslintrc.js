module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    project: ['tsconfig.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'always'],
    'comma-dangle': 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/comma-dangle': ['error', {
      arrays: 'never',
      objects: 'always-multiline',
      imports: 'never',
      exports: 'never',
      functions: 'never',
    }],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'no-prototype-builtins': 'off',
  },
};
