import express from "express";
import swaggerUI from "swagger-ui-express";
import swaggerDocs from "../swagger.json";
import * as Routers from "./Routers";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res
    .status(200)
    .send(
      req.query.echo ? `Server running, ${req.query.echo}!` : `Server running!`
    );
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use("/todo", Routers.toDoRouter);
app.use("/todo_list", Routers.toDoListRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
