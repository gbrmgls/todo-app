import ToDo from "./ToDo";
import ToDoList from "./ToDoList";
import UI from "./UI";

const ReducerCombiner: any = {
  ...ToDo,
  ...ToDoList,
  ...UI,
};

export default ReducerCombiner;
