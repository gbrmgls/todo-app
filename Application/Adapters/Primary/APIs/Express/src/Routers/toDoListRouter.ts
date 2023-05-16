import express from "express";
import * as State from "../../../../../../State";
const toDoListRouter = express.Router();

toDoListRouter.get("/get", async (req, res) => {
  res.json(await State.Actions.ToDoList.get());
});

toDoListRouter.post("/get", async (req, res) => {
  res.json(await State.Actions.ToDoList.get(req.body));
});

toDoListRouter.post("/create", async (req, res) => {
  res.json(await State.Actions.ToDoList.create(req.body));
});

toDoListRouter.patch("/update", async (req, res) => {
  const ids = Array.isArray(req.query.id) ? req.query.id : [req.query.id];

  res.json(await State.Actions.ToDoList.update(req.body, ids as string[]));
});

toDoListRouter.delete("/delete/", async (req, res) => {
  const ids = Array.isArray(req.query.id) ? req.query.id : [req.query.id];

  res.json(await State.Actions.ToDoList.delete(ids as string[]));
});

toDoListRouter.patch("/add_todos/", async (req, res) => {
  const toDosIds = Array.isArray(req.query.toDo)
    ? req.query.toDo
    : [req.query.toDo];
  const toDoListsIds = Array.isArray(req.query.toDoList)
    ? req.query.toDoList
    : [req.query.toDoList];

  res.json(
    await State.Actions.ToDoList.addToDos(
      toDosIds as string[],
      toDoListsIds as string[]
    )
  );
});

toDoListRouter.patch("/remove_todos/", async (req, res) => {
  const toDosIds = Array.isArray(req.query.toDo)
    ? req.query.toDo
    : [req.query.toDo];
  const toDoListsIds = Array.isArray(req.query.toDoList)
    ? req.query.toDoList
    : [req.query.toDoList];

  res.json(
    await State.Actions.ToDoList.removeToDos(
      toDosIds as string[],
      toDoListsIds as string[]
    )
  );
});

export default toDoListRouter;
