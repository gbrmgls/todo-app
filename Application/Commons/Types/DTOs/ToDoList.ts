export default interface ToDoList {
  id?: string;
  index?: number;
  toDos?: string[];
  done?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
