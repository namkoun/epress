import { Router } from "express";
import _ from "lodash";
import sequelize from "sequelize";
import faker from "faker";
import bcrypt from "bcrypt";
faker.locale = "ko";


const seq = new sequelize('express', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
  
});




const check_sequelize_auth = async () => {
  try{
    await seq.authenticate();
    console.log("연결 성공");
  }catch(err){
    console.log("연결 실패: ", err);
  }
};


check_sequelize_auth();
const User = seq.define("user", {
  name: {
    type: sequelize.STRING,
    allowNull: false
  },
  age: {
    type: sequelize.INTEGER,
    allowNull: false
  }
});


  const initDb = async() => {
  await User.sync();
  await Board.sync();
  }
  //initDb();



// const user_sync = async() =>{
//   try{
//     await User.sync({force:true});
//    for(let i=0; i<100; i++){
//       await User.create({
//         name: faker.name.lastName()+faker.name.firstName(),
//       age: getRandomInt(15,50),
//       password: hashpwd
//       });
//     }
//     console.log("생성: ");
//   }catch(err){
//    console.log("생성 실패: ", err);
//   }
// }
// user_sync();


// User.sync({ force: true }).then(()=>{
//   return User.create({
//     name: faker.name.lastName()+faker.name.firstName(),
//     age: getRandomInt(15,50)
//   });
// }).then(()=>{
//   return User.create({
//     name: faker.name.lastName()+faker.name.firstName(),
//     age: getRandomInt(15,50)
//   });
// });



const usersRouter = Router();



const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}



let users = [];
// for (let i = 1; i < 10000; i +=1){
//   users.push({
//     id: i,
//     name: faker.name.lastName()+faker.name.firstName(),
//     age: getRandomInt(15,50),
//   })
// }


  
  
  
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



    // const result = await User.findAll({
    //   attributes:['name','age'],
    //   where:{
    //     [Op.and] :[
    //       {age:24},
    //       {name: "현기선"}
    //     ]
    //   }
    // });


    // let filteredUsers = users;
    // if(name){
    //   filteredUsers = _.filter(filteredUsers , (user) =>{
    //     return users.name.includes(name);
    //   } );
    // }
    // if(age){
    //   filteredUsers = _.filter(filteredUsers, ['age', parseInt(age)] );
    // }


  // res.send({
  //   result
  //   // total_conut : filteredUsers.length,
  //   // filteredUsers
  // });
  });
  
  usersRouter.get("/:id", (req, res) => {
    const findUser = _.find(users,{id:parseInt(req.params.id)});
    let msg;
    if(findUser){
      msg = "정상적으로 조회했습니다"
      res.status(200).send({msg,findUser});
    }else{
      msg = "해당 아이디를 가진 유저가 없습니다."
      res.status(400).send({msg,findUser});
    }
  }); 

  
  //유저생성
  usersRouter.post("/", async(req, res) => {
try{
    const { name , age } = req.body;
  
    if(!name || !age ) res.status(400).send({ msg: "입력갓이 ㅈ잘못되었습니다"});
      
    const result = await User.create({name, age});
    res.status(201).send({
      msg: `id ${result.id}, ${result.name} 유저가 생성되었습니다.`
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
      if(name) user.name =name;
      if(age) user.age= age;
      await user.save();
      res.status(200).send({msg:'유저정보가 정상적으로 수정 되었습니다.'})
    }catch(err){
      console.log(err);
    res.status(500).send("문제있음 확인바람")
    }
});

//user 지우기
usersRouter.delete("/:id", (req, res) => {
    let findUser = _.find(users, {id: parseInt(req.params.id)});
    let result;
    if(findUser && findUser.id == req.params.id){
        users = _.reject(users, ["id", parseInt(req.params.id)]);
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
  try{
  // findAll
  const Op = sequelize.Op;
  const userResult = await User.findAll({
  attributes: ['id', 'name', 'age', 'updatedAt'],
  where: {
  /*
  (
  (`user`.`name` LIKE '김%' AND `user`.`age` = 29)
  OR
  (`user`.`name` LIKE '하%' AND `user`.`age` = 29)
  )
  */
  [Op.or] : [{
  [Op.and]: {
  name: { [Op.startsWith] : "김" },
  age: { [Op.between] : [20, 29] }
  }
  },{
  [Op.and]: {
  name: { [Op.startsWith] : "하" },
  age: { [Op.between] : [30, 40] }
  }
  }]
  },
  order : [['age', 'DESC'],['name', 'ASC']]
  });
  const boardResult = await Board.findAll({
  attributes: ['id', 'title', 'updatedAt', 'createdAt'],
  limit: 100
  });
  const user = await User.findOne({
  where : { id: req.params.id}
  });
  const board = await Board.findOne({
  where : { id: req.params.id}
  });
  if(!user || !board){
  res.status(400).send({ msg: '해당 정보가 존재하지 않습니다' });
  }
  await user.destroy();
  board.title += "test 타이틀 입니다.";
  await board.save();
  res.status(200).send({
  board,
  users: {
  count: userResult.length,
  data: userResult
  },
  boards: {
  count: boardResult.length,
  data: boardResult
  }
  });
  } catch (err){
  console.log(err)
  res.status(500).send({msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."})
  }
  });

  export default usersRouter;