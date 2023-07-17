import express, { Express, Request, Response } from "express";
import { List } from "./src/models/List";
import bodyParser from "body-parser";
import path, { dirname } from "path";

const app = express();
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
  const { id, title, content } = req.body;
  try {
    const lists = await List.create({ id, title, content});
    res.json(lists);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "오류가 발생했습니다." });
  }
});

app.get("/push", (req: Request, res: Response) => {
  res.render("push");
});

app.listen(port, () => {
  console.log("open server port" + port);
});
