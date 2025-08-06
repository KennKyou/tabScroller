import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022
      }
    },
    rules: {
      // 代碼品質
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      'no-console': ['warn', { 
        allow: ['warn', 'error'] 
      }],
      'prefer-const': 'error',
      'no-var': 'error',
      
      // 代碼風格
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      
      // 最佳實踐
      'eqeqeq': ['error', 'always'],
      'no-duplicate-imports': 'error',
      'no-useless-return': 'error',
      'consistent-return': 'error',
      
      // ES6+
      'arrow-spacing': 'error',
      'template-curly-spacing': ['error', 'never']
    },
    files: ['src/**/*.js', 'dist/**/*.js'],
    ignores: [
      'node_modules/**',
      '*.min.js',
      '.git/**'
    ]
  }
];