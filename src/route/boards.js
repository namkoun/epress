
import { Router } from "express";
import _ from "lodash";
import sequelize from "sequelize";
import faker from "faker";
faker.locale = "ko";

const boardsRouter = Router();

const seq = new sequelize('express', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
  
});
const Board = seq.define("board", {
  title: {
  type: sequelize.STRING,
  allowNull: false
  },
  content: {
  type: sequelize.TEXT,
  allowNull: true
  }
  });
  const board_sync = async() => {
    try{
      await Board.sync({force: true});
      for(let i=0; i < 10000; i++){
        await Board.create({
          title: faker.lorem.sentences(1),
          content: faker.lorem.sentences(10)
        })
      }
    }catch(err){
      console.log(err)
    }
  }
  
  //board_sync();
let boards = [];


  
  
boardsRouter.get("/", async(req, res) => {
    const boards = await Board.findAll();
    res.send({
      count: boards.length,
      boards
    });
  });
  
  boardsRouter.get("/:id", (req, res) => {
    const findboards = _.find(boards,{id:parseInt(req.params.id)});
    let msg;
    if(findboards){
      msg = "정상적으로 조회했습니다"
      res.status(200).send({msg,findboards});
    }else{
      msg = "해당 게시판이 없습니다."
      res.status(400).send({msg,findboards});
    }
  }); 
  
  //유저생성
  boardsRouter.post("/", (req, res) => {
    const createboard = req.body;
    const check_board = _.find(boards,["id",createboard.id]);
  
    let result; 
    if(!check_board && createboard.id && createboard.title && createboard.content){
        boards.push(createboard);
      result = `${createboard.title}게시글 생성 했습니다.`
    } else {
      result = '입력 요청값이 잘못되었습니다.'
    }
    res.status(201).send({
    result
    });
  });
  
  //content 내용 변경
  boardsRouter.put("/:id", (req, res) => {
    const findboard = _.find(boards, {id: parseInt(req.params.id)});
    let result;
    if(findboard && findboard.id == req.params.id){
        findboard.content = req.body.content;
        result = `게시글 내용을 ${findboard.content}으로 변경`;
        res.status(200).send({
            result
        });
    } else {
        result = `아이디가 ${req.params.id}인 게시글이 존재하지 않습니다.`;
        res.status(400).send({
            result
        });
    }
});

//user 지우기
boardsRouter.delete("/:id", (req, res) => {
    let findboard = _.find(boards, {id: parseInt(req.params.id)});
    let result;
    if(findboard && findboard.id == req.params.id){
        boards = _.reject(boards, ["id", parseInt(req.params.id)]);
        result = `아이디가 ${req.params.id}인 게시글 삭제`;
        res.status(200).send({
            result
        });
    } else {
        result = `아이디가 ${req.params.id}인 게시글이 존재하지 않습니다.`;
        res.status(400).send({
            result
        });
    }
});
  export default boardsRouter;