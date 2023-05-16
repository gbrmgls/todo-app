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
    <div className="flex flex-col justify-center items-center mx-2">
      <div className="flex flex-col w-[100%] md:w-[45rem]">
        <div className="flex flex-row w-[100%] justify-between">
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
                  className="stroke-current flex-shrink-0 h-6 w-6"
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

        <div className="flex flex-col w-[100%]">
          {state.toDoLists.map((list: Types.DTOs.ToDoList) => (
            <div
              className="flex flex-col w-[100%] mb-9 bg-gray-800 rounded-lg"
              key={list.id}
            >
              <div className="bg-gray-700 text-xl flex flex-row h-[100%] justify-between items-center rounded-lg">
                <div className="pl-2 text-white">ToDo List</div>
                <button
                  className="btn btn-secondary"
                  onClick={() => State.Actions.ToDoList.delete([list.id || ""])}
                >
                  delete list
                </button>
              </div>
              <div className="flex m-2">
                <button
                  className="btn btn-primary mr-2"
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
                  className="input input-bordered w-[100%]"
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
                  <div className="flex mb-2 items-center m-2" key={todo.id}>
                    <button
                      className="btn btn-secondary mr-2"
                      onClick={() => State.Actions.ToDo.delete([todo.id || ""])}
                    >
                      delete
                    </button>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-lg mr-2"
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
                      } input input-bordered`}
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
