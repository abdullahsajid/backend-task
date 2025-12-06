require("dotenv").config();
("use strict");

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { routers } from "./utils/routers";
import { cors } from "hono/cors";

const app = new Hono();
app.use(cors());

const port = process.env.PORT || 8080;

const server = serve({
  fetch: app.fetch,
  port: Number(port),
});

console.log(`Server is running on port ${port}`);

routers.forEach((router) => {
  app.route("/", router);
});
