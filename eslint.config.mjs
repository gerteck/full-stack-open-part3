import globals from "globals";
import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js'

// ...
export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
    },
    // Extend with Plugins
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': [
        'error',
        4
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true },
      ],
      'no-console': 0,
      "no-unused-vars": [
        "error",
        {
          "args": "all",
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ]


      // Using Windows, and Semicolons for JS
      // '@stylistic/js/semi': [
      //   'error',
      //   'never'
      // ],
      // '@stylistic/js/linebreak-style': [
      //   'error',
      //   'unix'
      // ],

    },
  },
  {
    // all files and subdirectories in the directory
    // ** is recursive wildcard
    ignores: ["dist/**", "build/**"],
  },
]