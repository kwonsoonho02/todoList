import express, { Express, Request, Response } from "express";

const app : Express = express();
const port = 5011;

app.listen(port, () => {
  console.log("open server port" + port);
});
