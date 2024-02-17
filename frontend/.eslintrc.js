module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/jsx-runtime",
        "next/core-web-vitals",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
    },
    plugins: ["@typescript-eslint", "etc"],
    rules: {
        "@typescript-eslint/switch-exhaustiveness-check": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "no-console": "error",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
        "react/jsx-filename-extension": [
            "error",
            {
                extensions: [".tsx"],
            },
        ],
        "react/function-component-definition": [
            "error",
            {
                namedComponents: "arrow-function",
            },
        ],
        "react/jsx-no-useless-fragment": "error",
        "react/jsx-no-literals": [
            "error",
            {
                noStrings: true,
                allowedStrings: ["...", "%"],
                ignoreProps: true,
                noAttributeStrings: true,
            },
        ],
        "@next/next/no-html-link-for-pages": ["error", "src/pages/"],
        // next/image is not compatible with export (https://nextjs.org/docs/messages/export-image-api)
        "@next/next/no-img-element": "off",
        "no-restricted-imports": [
            "error",
            {
                name: "next/image",
                message:
                    "<Image> component from Next is not compatible with next" +
                    " export feature and then cannot be used. A regular <img>" +
                    " element can be used instead.",
            },
            {
                name: "i18next",
                message:
                    "i18next base package does not enable hot module" +
                    " reloading in React and should be avoided. Use" +
                    " `useTranslation` from react-i18next package instead.",
            },
        ],
        eqeqeq: "error",
        "etc/no-commented-out-code": "error",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    reportUnusedDisableDirectives: true,
};
