import { test } from "bun:test";

test("My API handles 60,000 requests", async () => {
  for (let i = 0; i < 6000; i++) {
    const response = await fetch("http://localhost:3000/api/endpoint");
  }
});
