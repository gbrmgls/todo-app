import * as Types from "../../Commons/Types";

const ToDo = {
  [Types.Actions.ToDo.get]: async (
    state: any,
    toDos: Types.DTOs.ToDo[]
  ): Promise<Types.State> => {
    state.toDos = toDos;
    return state;
  },

  [Types.Actions.ToDo.update]: async (
    state: any,
    toDo: Types.DTOs.ToDo,
    toDosIds: string[]
  ): Promise<Types.State> => {
    state.toDos = state.toDos.map((oldToDo: Types.DTOs.ToDo) => {
      if (toDosIds.includes(oldToDo.id || "")) {
        oldToDo = { ...oldToDo, ...toDo };
      }
      return oldToDo;
    });

    return state;
  },

  [Types.Actions.ToDo.delete]: async (
    state: any,
    toDosIds: string[]
  ): Promise<Types.State> => {
    state.toDos = state.toDos.filter(
      (toDo: Types.DTOs.ToDo) => !toDosIds.includes(toDo.id || "")
    );

    return state;
  },
};

export default ToDo;
