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
const User_1 = require("./src/models/User");
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 5011;
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use(body_parser_1.default.json()); //요청 본문을 json 형태로 파싱
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.cookies.accessToken;
        const decodedToken = jsonwebtoken_1.default.decode(accessToken);
        if (req.cookies.accessToken === undefined) {
            res.send("로그인 부탁드려용");
            console.log("토큰 초기화");
        }
        else {
            console.log("아직 있음");
        }
        console.log(accessToken);
        const lists = yield List_1.List.findAll({
            where: { userid: decodedToken.userid }
        });
        console.log(lists);
        res.render("list", { lists });
    }
    catch (error) {
        res.status(500).json({ error });
    }
}));
app.post('/loginToken', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid } = req.body;
    const users = yield User_1.User.findOne({
        where: { userid }
    });
    console.log(users);
    if (!users) {
        res.status(403).send({
            msg: "로그인 실패"
        });
    }
    else {
        try {
            const accessToken = jsonwebtoken_1.default.sign({
                userid: users.userid
            }, process.env.ACCESS_SECRET_KEY || "defaultSecretKey", {
                expiresIn: '1h',
            });
            const refreshToken = jsonwebtoken_1.default.sign({
                userid: users.userid
            }, process.env.REFRESH_SECRET_KEY || "defaultSecretKey", {
                expiresIn: '24h',
            });
            res.cookie("accessToken", accessToken, { httpOnly: true });
            res.cookie("refreshToken", refreshToken, { httpOnly: true });
            res.status(200).json({ token: accessToken });
            console.log(accessToken);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }
}));
app.get("/refreshToken", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        const tokenData = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET_KEY || "defaultSecretKey");
        const users = yield User_1.User.findOne({
            where: { userid: tokenData.userid }
        });
        if (users !== null) {
            const accessToken = jsonwebtoken_1.default.sign({
                userid: users.userid
            }, process.env.ACCESS_SECRET_KEY || "defaultSecretKey", {
                expiresIn: '1h',
            });
            res.cookie("accessToken", accessToken, { httpOnly: true });
            res.status(200).json({ token: accessToken });
        }
        else {
            console.log("비워있다 이자식아.");
        }
        console.log(users);
    }
    catch (error) {
        console.log(error);
    }
}));
app.get("/logout", (req, res) => {
    try {
        res.clearCookie("accessToken");
        res.status(200).json("성공");
    }
    catch (error) {
        console.log(error);
    }
});
app.get('/join', (req, res) => {
    res.render("join");
});
app.get('/login', (req, res) => {
    res.render("login");
});
app.post("/add", (req, res) => {
    const { title, content } = req.body;
    try {
        const accessToken = req.cookies.accessToken;
        const userid = accessToken.userid;
        List_1.List.create({ title, content, userid }).then((list) => {
            console.log("아이디 자동 입력 : ", list.id);
        });
        res.redirect("/");
    }
    catch (error) {
        console.error("error", error);
        res.status(500).json({ error: "오류가 발생했습니다." });
    }
});
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
app.post("/patch/:id", (req, res) => {
    const { title, content } = req.body;
    let id = req.params.id;
    try {
        List_1.List.update({ title: title, content: content }, {
            where: { id: id }
        });
        res.redirect("/");
    }
    catch (error) {
        console.log("error", error);
    }
});
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
