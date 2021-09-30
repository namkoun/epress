import express from "express";

import usersRouter from "./route/users.js";
import boardsRouter from "./route/boards.js";

const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users",usersRouter);
app.use("/boards",boardsRouter);

app.listen(3001);
