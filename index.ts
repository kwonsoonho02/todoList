import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";

const app: Express = express();
const port = 5011;

let count: number = 1;
let arr: any[] = [];

let getObjectById = (id: number) => {
  let result;
  arr.forEach((el) => {
    if (Number(el.id) == Number(id)) result = el;
  });
  return result;
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.render("list", { data: arr });
  // console.log({data:arr})
});

app.post("/add", (req: Request, res: Response) => {
  let object = {
    id: count,
    title: req.body.title,
    content: req.body.content,
  };
  count++;
  arr.push(object);
  res.redirect("/");
});

app.get("/del/:id", (req: Request, res: Response) => {
  let idIndex = req.params.id;
  arr = arr.filter((value) => value.id != idIndex);
  console.log(arr);
  res.redirect('/')
});

app.get("/modify/:id", (req: Request, res: Response) => {
  let idIndex = req.params.id;
  res.render("modify", { data: arr, paramsId: idIndex });
});

app.post("/modifyEnd/:id", (req: Request, res: Response) => {
  let id = Number(req.params.id);
  let el: any = getObjectById(id);
  el.title = req.body.title;
  el.content = req.body.content;
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);

});
