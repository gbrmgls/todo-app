import express from "express";
import * as State from "../../../../../../State";
const toDoRouter = express.Router();

toDoRouter.get("/get", async (req, res) => {
  res.json(await State.Actions.ToDo.get());
});

toDoRouter.post("/get", async (req, res) => {
  res.json(await State.Actions.ToDo.get(req.body));
});

toDoRouter.post("/create", async (req, res) => {
  const lists = Array.isArray(req.query.list)
    ? req.query.list
    : [req.query.list];

  res.json(
    await State.Actions.ToDoList.createToDo(req.body, lists as string[])
  );
});

toDoRouter.patch("/update", async (req, res) => {
  const ids = Array.isArray(req.query.id) ? req.query.id : [req.query.id];

  res.json(await State.Actions.ToDo.update(req.body, ids as string[]));
});

toDoRouter.delete("/delete/", async (req, res) => {
  const ids = Array.isArray(req.query.id) ? req.query.id : [req.query.id];

  res.json(await State.Actions.ToDo.delete(ids as string[]));
});

export default toDoRouter;
