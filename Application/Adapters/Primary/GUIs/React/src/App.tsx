/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import * as State from "../../../../../State";
import * as Types from "../../../../../Commons/Types";

function App() {
  const [state, setState] = useState(State.Store.getState());
  const [newToDos, setNewToDos] = useState<Types.DTOs.ToDo[]>([]);

  // Initializing component state
  useEffect(() => {
    State.Store.subscribe(setState);
    return () => State.Store.unsubscribe(setState);
  }, []);

  // Initializing local input control
  useEffect(() => {
    setNewToDos(
      state.toDoLists.map((toDoList) => {
        return {
          id: toDoList.id || "",
          value:
            newToDos.find(
              (newToDo: Types.DTOs.ToDo) => newToDo.id == toDoList.id
            )?.value || "",
        };
      })
    );
  }, [state]);

  return (
    <div className="mx-2 flex flex-col items-center justify-center">
      <div className="flex w-[100%] flex-col md:w-[45rem]">
        <div className="flex w-[100%] flex-row justify-between">
          <button
            className="btn my-5"
            onClick={() => State.Actions.ToDoList.create()}
          >
            create list
          </button>
          {state.error.show && (
            <div className="alert alert-error my-2 w-fit">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 flex-shrink-0 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  onClick={() => State.Actions.UI.closeError()}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{state.error.message}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex w-[100%] flex-col">
          {state.toDoLists.map((list: Types.DTOs.ToDoList) => (
            <div
              className="mb-9 flex w-[100%] flex-col rounded-lg bg-gray-800"
              key={list.id}
            >
              <div className="flex h-[100%] flex-row items-center justify-between rounded-lg bg-gray-700 text-xl">
                <div className="pl-2 text-white">ToDo List</div>
                <button
                  className="btn-secondary btn"
                  onClick={() => State.Actions.ToDoList.delete([list.id || ""])}
                >
                  delete list
                </button>
              </div>
              <div className="m-2 flex">
                <button
                  className="btn-primary btn mr-2"
                  onClick={() => {
                    State.Actions.ToDoList.createToDo(
                      {
                        value: newToDos.find(
                          (newToDo: Types.DTOs.ToDo) => newToDo.id == list.id
                        )?.value,
                      },
                      [list.id || ""]
                    );
                    setNewToDos(
                      newToDos.map((newToDo: Types.DTOs.ToDo) => {
                        if (newToDo.id == list.id) {
                          newToDo.value = "";
                        }
                        return newToDo;
                      })
                    );
                  }}
                >
                  Add
                </button>
                <input
                  type="text"
                  className="input-bordered input w-[100%]"
                  value={
                    newToDos.find(
                      (newToDo: Types.DTOs.ToDo) => newToDo.id == list.id
                    )?.value || ""
                  }
                  onChange={(e) => {
                    setNewToDos(
                      newToDos.map((newToDo: Types.DTOs.ToDo) => {
                        if (newToDo.id == list.id) {
                          newToDo.value = e.target.value;
                        }
                        return newToDo;
                      })
                    );
                  }}
                ></input>
              </div>
              {state.toDos
                .filter((toDo: Types.DTOs.ToDo) =>
                  list.toDos?.includes(toDo.id || "")
                )
                .map((todo) => (
                  <div className="m-2 mb-2 flex items-center" key={todo.id}>
                    <button
                      className="btn-secondary btn mr-2"
                      onClick={() => State.Actions.ToDo.delete([todo.id || ""])}
                    >
                      delete
                    </button>
                    <input
                      type="checkbox"
                      className="checkbox-primary checkbox checkbox-lg mr-2"
                      checked={todo.done}
                      onChange={(e) => {
                        e.target.checked
                          ? State.Actions.ToDo.update({ done: true }, [
                              todo.id || "",
                            ])
                          : State.Actions.ToDo.update({ done: false }, [
                              todo.id || "",
                            ]);
                      }}
                    ></input>
                    <input
                      className={`w-[100%] ${
                        todo.done ? "line-through" : ""
                      } input-bordered input`}
                      type="text"
                      value={todo.value}
                      onChange={(e) =>
                        State.Actions.ToDo.update({ value: e.target.value }, [
                          todo.id || "",
                        ])
                      }
                    ></input>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
