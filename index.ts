import express, { Express, Request, Response } from "express";
import { List } from "./src/models/List";
import { User } from "./src/models/User"
import bodyParser from "body-parser";
import path, { dirname } from "path";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

dotenv.config();


const app: Express = express();
const port = 5011;


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(bodyParser.json()); //요청 본문을 json 형태로 파싱
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  try {
    
    const accessToken = req.cookies.accessToken;
    const decodedToken = jwt.decode(accessToken) as { userid: string };
    if(req.cookies.accessToken == undefined){
      console.log("토큰 초기화")
    }else{
      console.log("아직 있음")
    }
    console.log(accessToken)

    const lists = await List.findAll({
      where : { userid : decodedToken.userid }
    });
    console.log(lists)
    
    res.render("list", { lists });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post('/loginToken', async (req: Request, res: Response) => {
  const { userid } = req.body;
  const users = await User.findOne({
    where: { userid }
  });

  console.log(users)

  if (!users) {
    res.status(403).send({
      msg: "로그인 실패"
    });
  } else {
    try {
      const accessToken = jwt.sign({
        userid: users.userid
      }, process.env.ACCESS_SECRET_KEY || "defaultSecretKey", {
        expiresIn: '1h',
      });

      const refreshToken = jwt.sign({
        userid: users.userid
      }, process.env.REFRESH_SECRET_KEY || "defaultSecretKey", {
        expiresIn: '24h',
      });

      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });

      res.status(200).json({ token: accessToken });

      console.log(accessToken)
    } catch (error) {
      res.status(500).json(error)
    }
  }
});

app.get("/refreshToken", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const tokenData = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY || "defaultSecretKey") as { userid: string }

    const users = await User.findOne({
      where: { userid: tokenData.userid }
    });

    if(users !== null) {
      const accessToken = jwt.sign({
        userid: users.userid
      }, process.env.ACCESS_SECRET_KEY || "defaultSecretKey", {
        expiresIn: '1h',
      });

      res.cookie("accessToken", accessToken, { httpOnly: true });

      res.status(200).json({ token: accessToken })

    } else{
      console.log("비워있다 이자식아.")
    }
    console.log(users);
  } catch (error) {
    console.log(error)
  }
})

app.get("/logout", (req : Request, res : Response) => {
  try {

    res.clearCookie("accessToken");
    res.status(200).json("성공")

  } catch (error) {
    console.log(error);
  }
})

app.get('/join', (req: Request, res: Response) => {
  res.render("join");
})

app.get('/login', (req: Request, res: Response) => {
  res.render("login");
})


app.post("/add", (req: Request, res: Response) => {
  const { title, content } = req.body;
  try {
    const accessToken = req.cookies.accessToken;
    const userid : string =  accessToken.userid;
    // List.create(
    //   { title, content, userid }
    // ).then((list) => {
    //   console.log("아이디 자동 입력 : ", list.id)
    // })
    console.log(accessToken.userid)
    res.redirect("/")
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "오류가 발생했습니다." });
  }
});

app.get("/push", async (req: Request, res: Response) => {
  try {
    const lists = await List.findAll();
    res.render("push", { lists })
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "오류가 발생했습니다." });
  }
});

app.post("/patch/:id", (req: Request, res: Response) => {
  const { title, content } = req.body;
  let id = req.params.id;
  try {
    List.update(
      { title: title, content: content },
      {
        where: { id: id }
      }
    )
    res.redirect("/")
  } catch (error) {
    console.log("error", error)
  }
})

app.get("/delete/:id", async (req: Request, res: Response) => {
  let id = req.params.id;
  try {
    await List.destroy(
      {
        where: { id: id }
      }
    )
    res.redirect("/")
  } catch (error) {
    console.log("error", error);
  }
})

app.get("/modify/:id", async (req: Request, res: Response) => {
  let id = req.params.id;
  const lists = await List.findOne(
    {
      where: { id: id }
    }
  ).then((list) => {
    return list
  })
  res.render("modify", { paramsId: id, lists: lists });
})

app.listen(port, () => {
  console.log("open server port" + port);
});
