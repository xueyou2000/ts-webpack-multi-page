module.exports = {
    preset: "ts-jest",
    setupFilesAfterEnv: ["react-testing-library/cleanup-after-each"],
    testMatch: ["<rootDir>/tests/**/*.(spec|test).ts?(x)", "**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],
    moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy",
        "^.+\\.svg$": "jest-svg-transformer"
    },
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    }
};
