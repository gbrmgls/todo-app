import DAO from "../DAOs";
import * as Types from "../../../../Commons/Types";
import * as State from "../../../../State";
import IDBService from "./IDBService";

class ToDo implements IDBService {
  // constructor() {
  //   DAO.ToDo.subscribe(() => State.Actions.ToDo.get());
  // }

  async subscribe(callback: any): Promise<void> {
    DAO.ToDo.subscribe(callback);
  }

  async unsubscribe(callback: any): Promise<void> {
    DAO.ToDo.unsubscribe(callback);
  }

  async get(options?: any): Promise<Types.DTOs.ToDo[]> {
    return await DAO.ToDo.get(options);
  }
  async create(toDo: Types.DTOs.ToDo): Promise<Types.DTOs.ToDo> {
    return await DAO.ToDo.create(toDo);
  }

  async update(
    toDo: Types.DTOs.ToDo,
    toDosIds?: string[]
  ): Promise<Types.DTOs.ToDo[]> {
    return await DAO.ToDo.update(toDo, toDosIds);
  }

  async delete(toDosIds: string[]): Promise<boolean> {
    return await DAO.ToDo.delete(toDosIds);
  }
}

export default new ToDo();
