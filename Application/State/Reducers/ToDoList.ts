import * as Types from "../../Commons/Types";

const ToDoList = {
  [Types.Actions.ToDoList.get]: async (
    state: any,
    toDoLists: Types.DTOs.ToDoList[]
  ): Promise<Types.State> => {
    state.toDoLists = toDoLists;

    return state;
  },

  [Types.Actions.ToDoList.create]: async (
    state: any,
    toDoList: Types.DTOs.ToDoList
  ): Promise<Types.State> => {
    state.toDoLists.push(toDoList);

    return state;
  },

  [Types.Actions.ToDoList.update]: async (
    state: any,
    toDoList: Types.DTOs.ToDoList,
    toDoListsIds: string[]
  ): Promise<Types.State> => {
    state.toDoLists = state.toDoLists.map(
      (oldToDoList: Types.DTOs.ToDoList) => {
        if (toDoListsIds.includes(oldToDoList.id || "")) {
          oldToDoList = { ...oldToDoList, ...toDoList };
        }
        return toDoList;
      }
    );

    return state;
  },

  [Types.Actions.ToDoList.delete]: async (
    state: any,
    toDoListsIds: string[]
  ): Promise<Types.State> => {
    state.toDoLists = state.toDoLists.filter(
      (toDoList: Types.DTOs.ToDoList) =>
        !toDoListsIds.includes(toDoList.id || "")
    );

    return state;
  },

  [Types.Actions.ToDoList.addToDos]: async (
    state: any,
    toDosIds: string[],
    toDoListsIds: string[]
  ): Promise<Types.State> => {
    state.toDoLists = state.toDoLists.map((toDoList: Types.DTOs.ToDoList) => {
      if (toDoListsIds.includes(toDoList.id || "")) {
        toDosIds.map((toDoId: string) => {
          if (!toDoList.toDos?.includes(toDoId)) {
            toDoList.toDos?.push(toDoId);
          }
        });
      }
    });

    return state;
  },

  [Types.Actions.ToDoList.removeToDos]: async (
    state: any,
    toDosIds: string[],
    toDoListsIds: string[]
  ): Promise<Types.State> => {
    state.toDoLists = state.toDoLists.map((toDoList: Types.DTOs.ToDoList) => {
      if (toDoListsIds.includes(toDoList.id || "")) {
        toDosIds.map((toDoId: string) => {
          if (!toDoList.toDos?.includes(toDoId)) {
            toDoList.toDos = toDoList.toDos?.filter(
              (toDo: string) => toDo !== toDoId
            );
          }
        });
      }
    });

    return state;
  },

  [Types.Actions.ToDoList.createToDo]: async (
    state: any,
    toDo: Types.DTOs.ToDo,
    toDoListsIds: string[]
  ): Promise<Types.State> => {
    state.toDos.push(toDo);

    state.toDoLists = state.toDoLists.map((toDoList: Types.DTOs.ToDoList) => {
      if (toDoListsIds.includes(toDoList.id || "")) {
        toDoList.toDos?.push(toDo.id || "");
      }
      return toDoList;
    });

    return state;
  },
};

export default ToDoList;
