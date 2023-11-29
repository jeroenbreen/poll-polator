module.exports = {
    root: true,

    env: {
        node: true,
    },

    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/typescript/recommended",
        "plugin:prettier/recommended",
    ],

    parserOptions: {
        ecmaVersion: 2020,
    },

    ignorePatterns: ["data/municipalities.ts"],

    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "vue/multi-word-component-names": "off",
        "vue/no-mutating-props": "off",
        "no-case-declarations": "off",
        "@typescript-eslint/ban-ts-comment": "off",
    },

    overrides: [
        {
            files: [
                "**/__tests__/*.{j,t}s?(x)",
                "**/tests/unit/**/*.spec.{j,t}s?(x)",
            ],
            env: {
                jest: true,
            },
        },
    ],
};