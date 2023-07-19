import express, { Express, Request, Response } from "express";
import { List } from "./src/models/List";
import { User } from "./src/models/User"
import bodyParser from "body-parser";
import path, { dirname } from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"


const app : Express = express();
const port = 5011;
dotenv.config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(bodyParser.json()); //요청 본문을 json 형태로 파싱
app.use(bodyParser.urlencoded({ extended: false }));

  
app.get("/", async (req: Request, res: Response) => {
  try {
    const lists = await List.findAll();
    res.render("list", {lists});
  } catch (error) {
    res.status(500).json({ error: "오류가 발생했습니다." });
  }
});

app.get('/login', (req : Request, res : Response) => {
  res.render("login");
})

app.get('/join', (req : Request, res : Response) => {
  res.render("join");
})

app.post('/loginInsert', async (req : Request, res : Response) => {
  const { userid , userpassword } = req.body;
  const users = await User.findOne({
    where : { userid, userpassword }
  })

    if(!users){
      res.status(403).send({
        msg : "로그인 실패"
      })
    } else{
      try{
        const accessToken = jwt.sign({
          userid : users.userid,
          userpassword : users.userpassword
        }, process.env.ACCESS_SECRET_KEY, {
          expiresIn : '1m',
        })

        
      }catch (error){

      }
    }
});



app.post("/add",  (req: Request, res: Response) => {
  const { title, content } = req.body;
  try {
     List.create(
      { title, content}
      ).then((list) => {
        console.log("아이디 자동 입력 : ", list.id )
      })
    res.redirect("/")
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "오류가 발생했습니다." });
  }
});

app.get("/push", async (req: Request, res: Response) => {
  try { 
    const lists = await List.findAll();
    res.render("push", {lists})
  } catch (error){
    console.error("error", error);
    res.status(500).json({ error: "오류가 발생했습니다." });
  }
});

app.post("/patch/:id", (req: Request, res: Response) => {
  const {title , content} = req.body;
  let id = req.params.id;
  try {
     List.update(
      { title : title, content : content},
      {
        where : { id : id }
      }
    )
    res.redirect("/")
  } catch (error){
    console.log("error", error)
  }
})

app.get("/delete/:id", async(req: Request, res: Response) => {
  let id = req.params.id;
  try {
    await List.destroy(
        {
          where : {id : id}
        }
      )
    res.redirect("/")  
  } catch (error) {
    console.log("error", error);
  }
})

app.get("/modify/:id",  async (req : Request, res : Response) => {
  let id = req.params.id;
  const lists = await List.findOne(
    {
      where : { id : id }
    }
  ).then((list) => {
    return list
  })
  res.render("modify", {paramsId: id, lists : lists });
})

app.listen(port, () => {
  console.log("open server port" + port);
});
