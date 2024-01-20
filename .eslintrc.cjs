 module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 'latest'
    },
    root: true,
    overrides: [
        {
            files: ['*.ts'],
            extends: ['plugin:@typescript-eslint/disable-type-checked'],
        },
    ],
    rules: {
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        eqeqeq: ['error', 'always'],
        'no-else-return': 'error',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-unused-vars': ['off'],
        'no-unused-vars': 'off',
        'no-useless-escape': 'off'
    },
    ignorePatterns: ['*.js', '**/*.js']
}