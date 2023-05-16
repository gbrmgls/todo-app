import * as Types from "../Commons/Types";
import * as Entities from "./Entities";
import * as UseCases from ".";
import * as DBServices from "../Adapters/Secondary/DBs/Services";
import * as APIServices from "../Adapters/Secondary/APIs/Services/";

class ToDo {
  async subscribe(callback: any): Promise<void> {
    DBServices.ToDo.subscribe(callback);
  }

  async unsubscribe(callback: any): Promise<void> {
    DBServices.ToDo.unsubscribe(callback);
  }

  async get(options?: any): Promise<Types.DTOs.ToDo[]> {
    return await DBServices.ToDo.get(options);
  }

  async create(toDo: Types.DTOs.ToDo): Promise<Types.DTOs.ToDo> {
    let todoEntity = Entities.ToDo.fromDTO(toDo);
    if (todoEntity.getValue() == "") {
      throw new Error(Types.Errors.ToDo.empty_value);
    } else if (todoEntity.getValue() == ":random") {
      todoEntity.setValue(await APIServices.TextGenerator.getPassword());
    } else if (todoEntity.getValue() == ":quote") {
      todoEntity.setValue(await APIServices.TextGenerator.getQuote());
    }

    const toDoDTO = todoEntity.toDTO();
    DBServices.ToDo.create(toDoDTO);
    return toDoDTO;
  }

  async update(
    toDo: Types.DTOs.ToDo,
    toDosIds?: string[]
  ): Promise<Types.DTOs.ToDo[]> {
    return await DBServices.ToDo.update(toDo, toDosIds);
  }

  async delete(toDosIds: string[]): Promise<boolean> {
    // If deleted toDo is still inside any list, remove it
    const toDoListsIds = (
      await UseCases.ToDoList.get({
        filter: { or: { toDos: toDosIds } },
      })
    ).map((toDoList) => toDoList.id || "");

    await UseCases.ToDoList.removeToDos(toDosIds, toDoListsIds);

    return await DBServices.ToDo.delete(toDosIds);
  }
}

export default new ToDo();
