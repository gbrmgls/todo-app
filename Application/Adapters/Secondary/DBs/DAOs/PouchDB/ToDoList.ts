import * as Types from "../../../../../Commons/Types";
import * as Clients from "../../Clients";
import IDAO from "../IDAO";

class ToDoListPouchDBDAO implements IDAO {
  public async subscribe(callback: any) {
    Clients.PouchDBClient.subscribe(callback);
  }

  public async unsubscribe(callback: any) {
    Clients.PouchDBClient.unsubscribe(callback);
  }

  public async get(options?: any): Promise<Types.DTOs.ToDoList[]> {
    const { filter = {} } = options ?? {};
    const toDoListDTOs: Types.DTOs.ToDoList[] = [];

    const orList: any = [];
    const andList: any = [];

    // Build PouchDB filters
    if (Object.keys(filter).length > 0) {
      // AND filters
      if ("and" in filter) {
        const and: any = filter.and;
        // Id AND filter
        if ("ids" in and && and.ids.length > 0) {
          andList.push(
            ...and.ids.map((id: string) => {
              return {
                _id: id,
              };
            })
          );
        }

        // ToDos AND filter
        if ("toDos" in and && and.toDos.length > 0) {
          andList.push({
            toDos: {
              $in: and.toDos,
            },
          });
        }

        // Done AND filter
        if ("done" in and) {
          andList.push({
            done: and.done,
          });
        }
      }

      // OR filters
      if ("or" in filter) {
        const or: any = filter.or;
        // Id OR filter
        if ("ids" in or && or.ids.length > 0) {
          orList.push(
            ...or.ids.map((id: string) => {
              return {
                _id: id,
              };
            })
          );
        }

        // ToDos AND filter
        if ("toDos" in or && or.toDos.length > 0) {
          orList.push({
            toDos: {
              $in: or.toDos,
            },
          });
        }

        // Done AND filter
        if ("done" in or) {
          orList.push({
            done: or.done,
          });
        }
      }
    }

    // Add all to selector
    const DBSelector = {
      type: "todoList",
      $or: orList,
      $and: andList,
      index: { $gt: null },
    };

    // // Delete empty filters
    Object.entries(DBSelector).map(([key, value]) => {
      if (value.length == 0) {
        delete DBSelector[key as keyof typeof DBSelector];
      }
    });

    // Create search index on field "index"
    await Clients.PouchDBClient.db.createIndex({
      index: {
        fields: ["index"],
      },
    });

    // Run DB query
    const DBToDos = (
      await Clients.PouchDBClient.db.find({
        selector: DBSelector,
        sort: ["index"],
      })
    ).docs;

    DBToDos?.map(async (toDoList: any) =>
      toDoListDTOs.push({
        id: toDoList._id,
        index: toDoList.index,
        toDos: toDoList.toDos,
        done: toDoList.done,
        createdAt: toDoList.createdAt,
        updatedAt: toDoList.updatedAt,
      })
    );

    return toDoListDTOs;
  }

  public async create(
    toDoList: Types.DTOs.ToDoList
  ): Promise<Types.DTOs.ToDoList> {
    const data = {
      _id: toDoList.id,
      type: "todoList",
      index: toDoList.index,
      toDos: toDoList.toDos,
      done: toDoList.done,
      createdAt: toDoList.createdAt,
      updatedAt: toDoList.updatedAt,
    };

    const DBNewToDo = await Clients.PouchDBClient.db.get(
      (
        await Clients.PouchDBClient.db.put(data)
      ).id
    );

    const newToDoList: Types.DTOs.ToDoList = {
      id: DBNewToDo._id,
      index: DBNewToDo.index,
      toDos: DBNewToDo.toDos,
      done: DBNewToDo.done,
      createdAt: DBNewToDo.createdAt,
      updatedAt: DBNewToDo.updatedAt,
    };
    DBNewToDo;
    return newToDoList;
  }

  public async update(
    toDoList: Types.DTOs.ToDoList,
    toDosIds?: string[]
  ): Promise<Types.DTOs.ToDoList[]> {
    // Gets toDo DTO id as update key if no ids are passed
    const updateIds: string[] = toDosIds || [toDoList.id || ""];
    const orList: any = [];

    // Build PouchDB filters
    orList.push(
      ...updateIds.map((id: string) => {
        return {
          _id: id,
        };
      })
    );

    // Run DB query
    let DBToDos = (
      await Clients.PouchDBClient.db.find({
        selector: {
          type: "todoList",
          $or: orList,
        },
      })
    ).docs;

    // Updates returned DB items
    DBToDos = DBToDos.map((DBToDo: any) => {
      return {
        _id: DBToDo._id,
        _rev: DBToDo._rev,
        type: DBToDo.type,
        index: "index" in toDoList ? toDoList.index : DBToDo.index,
        toDos: "toDos" in toDoList ? toDoList.toDos : DBToDo.toDos,
        done: "done" in toDoList ? toDoList.done : DBToDo.done,
        createdAt:
          "createdAt" in toDoList ? toDoList.createdAt : DBToDo.createdAt,
        updatedAt:
          "updatedAt" in toDoList ? toDoList.updatedAt : DBToDo.updatedAt,
      };
    });

    // Persist DB item updates
    await Clients.PouchDBClient.db.bulkDocs(DBToDos);

    return DBToDos;
  }

  public async delete(toDoIds: string[]): Promise<boolean> {
    const orList: any = [];
    let success = true;

    orList.push(
      ...toDoIds.map((id: string) => {
        return {
          _id: id,
        };
      })
    );

    // Add all to selector
    const DBSelector = {
      type: "todoList",
      $or: orList,
    };

    // Run DB query
    const DBToDos = (
      await Clients.PouchDBClient.db.find({
        selector: DBSelector,
      })
    ).docs;

    const deletions = await Clients.PouchDBClient.db.bulkDocs(
      DBToDos.map((DBToDos: any) => {
        return { ...DBToDos, _deleted: true };
      })
    );

    if (deletions.length < deletions.filter((deletion: any) => deletion.ok)) {
      success = false;
    }

    return success;
  }
}

export default new ToDoListPouchDBDAO();
