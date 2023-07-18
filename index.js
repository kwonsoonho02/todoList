"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const List_1 = require("./src/models/List");
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = 5011;
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use(body_parser_1.default.json()); //요청 본문을 json 형태로 파싱
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lists = yield List_1.List.findAll();
        res.render("list", { lists });
    }
    catch (error) {
        res.status(500).json({ error: "오류가 발생했습니다." });
    }
}));
app.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    try {
        yield List_1.List.create({ title, content }).then((list) => {
            console.log("아이디 자동 입력 : ", list.id);
        });
        res.redirect("/");
    }
    catch (error) {
        console.error("error", error);
        res.status(500).json({ error: "오류가 발생했습니다." });
    }
}));
app.get("/push", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lists = yield List_1.List.findAll();
        res.render("push", { lists });
    }
    catch (error) {
        console.error("error", error);
        res.status(500).json({ error: "오류가 발생했습니다." });
    }
}));
app.post("/patch/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    let id = req.params.id;
    try {
        yield List_1.List.update({ title: title, content: content }, {
            where: { id: id }
        });
        res.redirect("/");
    }
    catch (error) {
        console.log("error", error);
    }
}));
app.get("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    try {
        yield List_1.List.destroy({
            where: { id: id }
        });
        res.redirect("/");
    }
    catch (error) {
        console.log("error", error);
    }
}));
app.get("/modify/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    const lists = yield List_1.List.findOne({
        where: { id: id }
    }).then((list) => {
        return list;
    });
    res.render("modify", { paramsId: id, lists: lists });
}));
app.listen(port, () => {
    console.log("open server port" + port);
});
