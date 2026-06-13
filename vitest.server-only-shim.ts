// Shim — "server-only" lança em ambiente não-server. Em vitest (jsdom) isso quebra
// imports legítimos de graph.ts. Aliased pra este noop no vitest.config.ts.
export {};
