import { Router } from "express";
import _ from "lodash";
import sequelize from "sequelize";
import faker from "faker";

import db from "../models/index.js";


faker.locale = "ko";
const { User, Permission,Board } = db;



const usersRouter = Router();




  
  console.log("준비됨")
  
  usersRouter.get("/", async(req, res) => {
    let {name , age} = req.query;
    const { Op } = sequelize;

    try{
      const findUserQuery = {
        attributes:['name', 'age'],
      }
      let result;
      if(name && age){
        findUserQuery['where'] = {name: {[Op.substring]: name}, age}
      }else if(name){
        findUserQuery['where'] = {name: {[Op.substring]: name}}
      }else if(age){
        findUserQuery['where'] = {age}
      }
      result = await User.findAll(findUserQuery);
      
      res.status(200).send({
        count: result.length,
        result
      })
    }catch(err){
      console.log(err);
      res.status(500).send("문제있음 확인바람")
    }
  });
  
  usersRouter.get("/:id", async(req, res) => {
    try{
      const findUser = await User.findOne({
        include:[Permission, Board],
        include:[{
          model: Permission,
          attributes: ["id","title","level"],
        },{
          model:Board,
          attributes:["id","title"]
        }],
        where:{
          id: req.params.id
        }
      });
      res.status(200).send({
        findUser
    });

    }catch(err){
      console.log(err);
      res.status(500).send("문제있음 확인바람")
    }
  
});

  
  //유저생성
  usersRouter.post("/", async(req, res) => {
try{
    const { name , age, permission } = req.body;
  
    if(!name || !age ) res.status(400).send({ msg: "입력갓이 ㅈ잘못되었습니다"});
      
    const user = await User.create({name, age});

    await user.createPermission({
      title: permission.title,
      level: permission.level,
      name: permission.name,
      age: permission.age,
    })

    res.status(201).send({
      msg: `id ${user.id}, ${user.name} 유저가 생성되었습니다.`
    });
      
  }catch(err){
    console.log(err);
    res.status(500).send("문제있음 확인바람")
  }
  });

  
  //name 변경
  usersRouter.put("/:id", async(req, res) => {
    try{
      const{name, age} = req.body;

      let user = await User.findOne({
        where:{
          id: req.params.id
        }
      })
      if(name) User.name =name;
      if(age) User.age= age;
      await User.save();
      res.status(200).send({msg:'유저정보가 정상적으로 수정 되었습니다.'})
    }catch(err){
      console.log(err);
    res.status(500).send("문제있음 확인바람")
    }
});

//user 지우기
usersRouter.delete("/:id", (req, res) => {
    let findUser = _.find(User, {id: parseInt(req.params.id)});
    let result;
    if(findUser && findUser.id == req.params.id){
        users = _.reject(User, ["id", parseInt(req.params.id)]);
        result = `아이디가 ${req.params.id}인 유저 삭제`;
        res.status(200).send({
            result
        });
    } else {
        result = `아이디가 ${req.params.id}인 유저가 존재하지 않습니다.`;
        res.status(400).send({
            result
        });
    }
});


usersRouter.get("/test/:id", async(req, res) => {
  try {
      const { Op } = sequelize;
      const page = req.body.page;
      const size = req.body.size;
      const offset = (page - 1) * size;

      // const userResult = await User.findAll({
      //     limit: 100
      // })

      // const boardResult = await Board.findAll({
      //     limit: 100
      // });

      // res.status(200).send({
      //     user: {
      //         count: userResult.length,
      //         result: userResult,
      //     },
      //     board: {
      //         count: boardResult.length,
      //         result: boardResult
      //     }
      // });

      const findUser = await User.findOne({
          where : {id: 1000}
      })

      // findUser.name = "김남경";
      // //findUser.save();
      // findUser.destroy();

      res.status(200).send({
          result: findUser
      });
  } catch(err) {
      console.log(err);
      res.status(500).send("서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
});

  export default usersRouter;