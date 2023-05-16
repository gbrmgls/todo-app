import * as Clients from "../../Clients";
import IDAO from "../IDAO";
import * as Types from "../../../../../Commons/Types";

class ToDoPouchDBDAO implements IDAO {
  public async subscribe(callback: any) {
    Clients.PouchDBClient.subscribe(callback);
  }

  public async unsubscribe(callback: any) {
    Clients.PouchDBClient.unsubscribe(callback);
  }

  public async get(options?: any): Promise<Types.DTOs.ToDo[]> {
    const { filter = {} } = options ?? {};
    const toDoDTOs: Types.DTOs.ToDo[] = [];

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
        // Value AND filter
        if ("value" in and) {
          andList.push({
            value: {
              $regex: new RegExp(and.value, "i"),
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
        // Value AND filter
        if ("value" in or) {
          orList.push({
            value: {
              $regex: new RegExp(or.value, "i"),
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
      type: "todo",
      $or: orList,
      $and: andList,
      index: { $gt: true },
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

    DBToDos?.map(async (toDo: any) =>
      toDoDTOs.push({
        id: toDo._id,
        index: toDo.index,
        value: toDo.value,
        done: toDo.done,
        createdAt: toDo.createdAt,
        updatedAt: toDo.updatedAt,
      })
    );

    return toDoDTOs;
  }

  public async create(toDo: Types.DTOs.ToDo): Promise<Types.DTOs.ToDo> {
    const data = {
      _id: toDo.id,
      type: "todo",
      index: toDo.index,
      value: toDo.value,
      done: toDo.done,
      createdAt: toDo.createdAt,
      updatedAt: toDo.updatedAt,
    };

    const DBNewToDo = await Clients.PouchDBClient.db.get(
      (
        await Clients.PouchDBClient.db.put(data)
      ).id
    );

    const newToDo: Types.DTOs.ToDo = {
      id: DBNewToDo._id,
      index: DBNewToDo.index,
      value: DBNewToDo.value,
      done: DBNewToDo.done,
      createdAt: DBNewToDo.createdAt,
      updatedAt: DBNewToDo.updatedAt,
    };
    DBNewToDo;
    return newToDo;
  }

  public async update(
    toDo: Types.DTOs.ToDo,
    toDosIds?: string[]
  ): Promise<Types.DTOs.ToDo[]> {
    // Gets toDo DTO id as update key if no ids are passed
    const updateIds: string[] = toDosIds || [toDo.id || ""];
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
          type: "todo",
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
        index: "index" in toDo ? toDo.index : DBToDo.index,
        value: "value" in toDo ? toDo.value : DBToDo.value,
        done: "done" in toDo ? toDo.done : DBToDo.done,
        createdAt: "createdAt" in toDo ? toDo.createdAt : DBToDo.createdAt,
        updatedAt: "updatedAt" in toDo ? toDo.updatedAt : DBToDo.updatedAt,
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
      type: "todo",
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

export default new ToDoPouchDBDAO();
