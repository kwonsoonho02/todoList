import express, { Express, Request, Response } from "express";
import { List } from "./src/models/List";
import bodyParser from "body-parser";
import path, { dirname } from "path";

const app : Express = express();
const port = 5011;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(bodyParser.json()); //요청 본문을 json 형태로 파싱
app.use(bodyParser.urlencoded({ extended: true }));

  
app.get("/", async (req: Request, res: Response) => {
  try {
    const lists = await List.findAll();
    res.render("list", {lists});
  } catch (error) {
    res.status(500).json({ error: "오류가 발생했습니다." });
  }
});

app.post("/add", async (req: Request, res: Response) => {
  const { title, content } = req.body;
  try {
    await List.create(
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

app.post("/patch/:id", async(req: Request, res: Response) => {
  const {title , content} = req.body;
  let id = req.params.id;
  try {
    await List.update(
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
  let idIndex = req.params.id;
  res.render("modify", {paramsId: idIndex });
})

app.listen(port, () => {
  console.log("open server port" + port);
});
