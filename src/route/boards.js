import { Router } from "express";
import db from '../models/index.js'

const { Board } = db;

const boardsRouter = Router();

  
  
boardsRouter.get("/", async(req, res) => {
  try{
    const boards = await Board.findAll();
    res.status(200).send({
      count: boards.length,
      boards
    })
  }catch(err){
console.log(err)
res.status(500).send({msg:"서버에 문제 발생"})
  }
  });
  
  boardsRouter.get("/:id", async(req, res) => {
    try{
    
      const findBoard = await Board.findOne({
        where: {
          id: req.params.id
        }
      });
      if(findBoard){
        res.status(200).send({
          
          findBoard
        })
      }else{
        res.status(400).send({msg:"해당아이디가 없습니다"})
      }
    }catch(err){
  console.log(err)
  res.status(500).send({msg:"서버에 문제 발생"})
    }
  }); 
  
  //유저생성
  boardsRouter.post("/", async(req, res) => {
    try{
      const {content, title} = req.body;
      if(!title) res.status(400).send({msg:"입력요청값이 잘못됨"})

      const result = await Board.create({
        title: title ? title : null,
        content: content ? content: null
      })

      res.status(201).send({
        msg: `id ${result.id}, ${result.title} 게시글이 생성되었습니다.`
      });

    }catch(err){
      console.log(err)
      res.status(500).send({msg:"서버에 문제 발생"})
    }
  });
  
  //content 내용 변경
  boardsRouter.put("/:id", async(req, res) => {
    try{
      const {title, content} = req.body
      let board = await Board.findOne({
        where:{
          id: req.params.id
        }
      })
      if(!board || (!title || !content)){
        res.status(400).send({msg:"게시글이 존재 하지 않습니다"})
      }
      if(title) board.title = title;
      if(content) board.content = content;

      await board.save();
      res.status(200).send({msg:"게시글이 수정되었습니다"})
    }catch(err){
      console.log(err)
      res.status(500).send({msg:"서버에 문제 발생"})
    }
   
});

//user 지우기
boardsRouter.delete("/:id", async(req, res) => {
  try{
    let board = await Board.findOne({
      where:{
        id: req.params.id
      }
    })
    
    if(!board){
      res.status(400).send({msg:"게시글이 존재 하지 않습니다"})
    } 
    

    await board.destroy();
    res.status(200).send({msg:"게시글이 삭제됬습니다"})
  }catch(err){
    console.log(err)
    res.status(500).send({msg:"서버에 문제 발생"})
  }
});
  export default boardsRouter;