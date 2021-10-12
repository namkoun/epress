import express from "express";

import usersRouter from "./route/users.js";
import boardsRouter from "./route/boards.js";

import db from "./models/index.js"

const app = express();
db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0",{raw: true})
    .then(() =>{
    db.sequelize.sync({force:true}).then(()=>{
        console.log("sync 끝")
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use("/users",usersRouter);
    app.use("/boards",boardsRouter);
    
    app.listen(3001);
    });

});