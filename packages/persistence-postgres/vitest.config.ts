import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "**/*.test.ts"],
    },
    // Tests require a real PostgreSQL database connection
    // Set TEST_DATABASE_URL environment variable to run tests
    testTimeout: 30000,
  },
});
