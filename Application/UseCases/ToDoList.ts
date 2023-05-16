import * as Types from "../Commons/Types";
import * as Entities from "./Entities";
import * as UseCases from ".";
import * as DBServices from "../Adapters/Secondary/DBs/Services";

class ToDoListUseCases {
  async subscribe(callback: any): Promise<void> {
    DBServices.ToDoList.subscribe(callback);
  }

  async unsubscribe(callback: any): Promise<void> {
    DBServices.ToDoList.unsubscribe(callback);
  }

  async get(options?: any): Promise<Types.DTOs.ToDoList[]> {
    return await DBServices.ToDoList.get(options);
  }

  async create(
    toDoList: Types.DTOs.ToDoList = {}
  ): Promise<Types.DTOs.ToDoList> {
    const toDoListDTO = Entities.ToDoList.fromDTO(toDoList).toDTO();
    DBServices.ToDoList.create(toDoListDTO);
    return toDoListDTO;
  }

  async update(
    toDoList: Types.DTOs.ToDoList,
    toDosIds?: string[]
  ): Promise<Types.DTOs.ToDoList[]> {
    return await DBServices.ToDoList.update(toDoList, toDosIds);
  }

  async delete(toDoListsIds: string[]): Promise<boolean> {
    // Delete contained toDos if not in any other toDoList
    let toDoLists = (
      await DBServices.ToDoList.get({
        filter: {
          or: { ids: toDoListsIds },
        },
      })
    ).map((toDoList) => Entities.ToDoList.fromDTO(toDoList));

    let toDosIds: any = [];

    toDoLists.map((toDoList) => toDosIds.push(...toDoList.getToDos())); // TODO: remove duplicates

    let toDosToBeDeleted: any = [];

    await Promise.all(
      toDosIds.map(async (toDoId: string) => {
        if ((await this.get({ filter: { toDos: [toDoId] } })).length == 1) {
          toDosToBeDeleted.push(toDoId);
        }
      })
    );

    await UseCases.ToDo.delete(toDosToBeDeleted);

    return await DBServices.ToDoList.delete(toDoListsIds);
  }

  async addToDos(
    toDosIds: string[],
    toDoListsIds?: string[]
  ): Promise<Types.DTOs.ToDoList[]> {
    let toDoListsDTOs = await DBServices.ToDoList.get({
      filter: { or: { ids: toDoListsIds } },
    });

    let toDoListsEntities = toDoListsDTOs.map((toDoList: Types.DTOs.ToDoList) =>
      Entities.ToDoList.fromDTO(toDoList)
    );

    // Filter non existent toDos before adding them to toDoLists
    toDosIds = (
      await UseCases.ToDo.get({
        filter: {
          or: { ids: toDosIds },
        },
      })
    ).map((toDo) => toDo.id || "");

    toDoListsEntities.map((toDoList: Entities.ToDoList) =>
      toDoList.addToDos(toDosIds)
    );

    toDoListsDTOs = toDoListsEntities.map((toDoList: Entities.ToDoList) =>
      toDoList.toDTO()
    );

    await Promise.all(
      toDoListsDTOs.map(async (toDoList: Types.DTOs.ToDoList) => {
        await DBServices.ToDoList.update(toDoList);
      })
    );

    return toDoListsDTOs;
  }

  async removeToDos(
    toDosIds: string[],
    toDoListsIds?: string[]
  ): Promise<Types.DTOs.ToDoList[]> {
    let toDoListsDTOs = await DBServices.ToDoList.get({
      filter: { or: { ids: toDoListsIds } },
    });

    let toDoListsEntities = toDoListsDTOs.map((toDoList: Types.DTOs.ToDoList) =>
      Entities.ToDoList.fromDTO(toDoList)
    );

    toDoListsEntities.map((toDoList: Entities.ToDoList) =>
      toDoList.removeToDos(toDosIds)
    );

    toDoListsDTOs = toDoListsEntities.map((toDoList: Entities.ToDoList) =>
      toDoList.toDTO()
    );

    await Promise.all(
      toDoListsDTOs.map(async (toDoList: Types.DTOs.ToDoList) => {
        await DBServices.ToDoList.update(toDoList);
      })
    );

    return toDoListsDTOs;
  }

  async createToDo(
    toDo: Types.DTOs.ToDoList,
    toDoListsIds: string[]
  ): Promise<Types.DTOs.ToDoList> {
    // Filter falsy toDoListsIds
    toDoListsIds = toDoListsIds.filter((toDoListId) => toDoListId);

    if (toDoListsIds.length == 0) {
      throw new Error("Cannot create toDo outside of a toDoList");
    }

    toDoListsIds = (
      await UseCases.ToDoList.get({ filter: { or: { ids: toDoListsIds } } })
    ).map((toDoList: Types.DTOs.ToDoList) => toDoList.id || "");

    let createdToDo = await UseCases.ToDo.create(toDo);

    await this.addToDos([createdToDo.id || ""], toDoListsIds);

    return createdToDo;
  }
}

export default new ToDoListUseCases();
