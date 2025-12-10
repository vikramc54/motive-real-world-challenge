import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.ts"],
    roots: ["<rootDir>/src"],
    setupFiles: ["tsconfig-paths/register"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    clearMocks: true,
    restoreMocks: true,
    // Use this if you want setup file for mongodb-memory-server lifecycle:
    // globalSetup: '<rootDir>/tests/setup/globalSetup.ts',
    // globalTeardown: '<rootDir>/tests/setup/globalTeardown.ts',
};

export default config;
