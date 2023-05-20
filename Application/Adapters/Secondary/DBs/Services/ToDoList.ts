import IDBService from "./IDBService";
import * as Types from "../../../../Commons/Types";
import DAO from "../DAOs";

class ToDoList implements IDBService {
  async subscribe(callback: any): Promise<void> {
    DAO.ToDo.subscribe(callback);
  }

  async unsubscribe(callback: any): Promise<void> {
    DAO.ToDo.unsubscribe(callback);
  }

  async get(options?: any): Promise<Types.DTOs.ToDoList[]> {
    return await DAO.ToDoList.get(options);
  }
  async create(toDoList: Types.DTOs.ToDoList): Promise<Types.DTOs.ToDoList> {
    return await DAO.ToDoList.create(toDoList);
  }

  async update(
    toDoList: Types.DTOs.ToDoList,
    toDoListsIds?: string[]
  ): Promise<Types.DTOs.ToDoList[]> {
    return await DAO.ToDoList.update(toDoList, toDoListsIds);
  }

  async delete(toDoListsIds: string[]): Promise<boolean> {
    return await DAO.ToDoList.delete(toDoListsIds);
  }
}

export default new ToDoList();
