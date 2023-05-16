import * as Types from "../Types";

export default interface State {
  toDos: Types.DTOs.ToDo[];
  toDoLists: Types.DTOs.ToDoList[];
  error: {
    show: boolean;
    message: string;
  };
}
