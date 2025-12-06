import { Hono } from "hono";
import { userRouter } from "../features/user/user-routes";

const rootRouter = new Hono();

rootRouter.get("/", (ctx) => ctx.text("Hello"));

export const routers = [rootRouter, userRouter];
