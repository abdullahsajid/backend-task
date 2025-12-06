import { Hono } from "hono";
import UserController from "./user-controller";

export const userRouter = new Hono();

userRouter.post("/chat", UserController.chat);
