import express from "express";
import index from "./server/index.js";
import http from "http";
import errorHandler from "./middleware/errorHandler.js";

export default class App {
  async start() {
    try {
      http.createServer(this.app).listen(process.env.HTTP_PORT, () => {
        console.log(`http server created for port no ${process.env.HTTP_PORT}`);
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  constructor() {
    this.app = express();
    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Methods", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.header("Access-Control-Max-Age", "1000");
      next();
    });

    this.app.get("/health", (req, res) => res.send("Health check route"));
    this.app.use("/api", index);
    this.app.use(errorHandler);
  }
}
