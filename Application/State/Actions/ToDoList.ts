import * as Types from "../../Commons/Types";
import * as UseCases from "../../UseCases";
import * as State from "..";

class ToDoList {
  private static subscribed: boolean = false;

  public async get(options?: any) {
    // Subscribes to DB changes on first call
    if (!ToDoList.subscribed) {
      ToDoList.subscribed = true;
      UseCases.ToDoList.subscribe(() => this.get());
    }
    const toDoLists = await UseCases.ToDoList.get(options);

    State.Store.actionHandler({
      name: Types.Actions.ToDoList.get,
      params: { toDoLists },
    });

    return toDoLists;
  }

  public async create(toDoList: Types.DTOs.ToDoList = {}) {
    const createdToDoList = await UseCases.ToDoList.create(toDoList);

    State.Store.actionHandler({
      name: Types.Actions.ToDoList.create,
      params: { createdToDoList },
    });

    return createdToDoList;
  }

  public async update(toDoList: Types.DTOs.ToDoList, toDoListsIds?: string[]) {
    State.Store.actionHandler({
      name: Types.Actions.ToDoList.update,
      params: { toDoList, toDoListsIds },
    });

    const updatedToDoLists = await UseCases.ToDoList.update(
      toDoList,
      toDoListsIds
    );

    return updatedToDoLists;
  }

  public async delete(toDoListsIds: string[]) {
    State.Store.actionHandler({
      name: Types.Actions.ToDoList.delete,
      params: { toDoListsIds },
    });

    const deletedToDoListsSuccessfully = await UseCases.ToDoList.delete(
      toDoListsIds
    );

    return deletedToDoListsSuccessfully;
  }

  public async addToDos(toDosIds: string[], toDoListsIds: string[]) {
    State.Store.actionHandler({
      name: Types.Actions.ToDoList.addToDos,
      params: { toDosIds, toDoListsIds },
    });

    const updatedToDoLists = await UseCases.ToDoList.addToDos(
      toDosIds,
      toDoListsIds
    );

    return updatedToDoLists;
  }

  public async removeToDos(toDosIds: string[], toDoListsIds: string[]) {
    State.Store.actionHandler({
      name: Types.Actions.ToDoList.removeToDos,
      params: { toDosIds, toDoListsIds },
    });

    const updatedToDoLists = await UseCases.ToDoList.removeToDos(
      toDosIds,
      toDoListsIds
    );

    return updatedToDoLists;
  }

  public async createToDo(toDo: Types.DTOs.ToDo, toDoListsIds: string[]) {
    try {
      const createdToDo = await UseCases.ToDoList.createToDo(
        toDo,
        toDoListsIds
      );
      State.Store.actionHandler({
        name: Types.Actions.ToDoList.createToDo,
        params: { createdToDo, toDoListsIds },
      });

      return createdToDo;
    } catch (error: any) {
      switch (error.message) {
        case Types.Errors.ToDo.empty_value:
          State.Actions.UI.displayError("ToDo value cannot be empty!");
          break;
        default:
          console.log("Unknown error:", error);
          break;
      }
    }
  }
}

export default new ToDoList();
