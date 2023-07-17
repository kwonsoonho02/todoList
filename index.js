"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const mariadb_1 = __importDefault(require("mariadb"));
const app = (0, express_1.default)();
const port = 5011;
let count = 1;
let arr = [];
let getObjectById = (id) => {
    let result;
    arr.forEach((el) => {
        if (Number(el.id) == Number(id))
            result = el;
    });
    return result;
};
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/", express_1.default.static("public"));
app.get("/", (req, res) => {
    res.render("list", { data: arr });
    // console.log({data:arr})
});
app.post("/add", (req, res) => {
    let object = {
        id: count,
        title: req.body.title,
        content: req.body.content,
    };
    count++;
    arr.push(object);
    res.redirect("/");
});
app.get("/del/:id", (req, res) => {
    let idIndex = req.params.id;
    arr = arr.filter((value) => value.id != idIndex);
    console.log(arr);
    res.redirect('/');
});
app.get("/modify/:id", (req, res) => {
    let idIndex = req.params.id;
    res.render("modify", { data: arr, paramsId: idIndex });
});
app.post("/modifyEnd/:id", (req, res) => {
    let id = Number(req.params.id);
    let el = getObjectById(id);
    el.title = req.body.title;
    el.content = req.body.content;
    res.redirect("/");
});
app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
    console.log(mariadb_1.default);
});
