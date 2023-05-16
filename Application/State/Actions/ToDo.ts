import * as Types from "../../Commons/Types";
import * as UseCases from "../../UseCases";
import * as State from "../../State";

class ToDo {
  private static subscribed: boolean = false;

  public async get(options?: any) {
    // Subscribes to DB changes on first call
    if (!ToDo.subscribed) {
      ToDo.subscribed = true;
      UseCases.ToDo.subscribe(() => this.get());
    }

    const toDos = await UseCases.ToDo.get(options);

    State.Store.actionHandler({
      name: Types.Actions.ToDo.get,
      params: { toDos },
    });

    return toDos;
  }

  public async update(toDo: Types.DTOs.ToDo, toDosIds?: string[]) {
    const updatedToDos = UseCases.ToDo.update(toDo, toDosIds);

    State.Store.actionHandler({
      name: Types.Actions.ToDo.update,
      params: { toDo, toDosIds },
    });

    return updatedToDos;
  }

  public async delete(toDosIds: string[]) {
    State.Store.actionHandler({
      name: Types.Actions.ToDo.delete,
      params: { toDosIds },
    });

    const deletedToDosSuccessfully = await UseCases.ToDo.delete(toDosIds);

    return deletedToDosSuccessfully;
  }
}

export default new ToDo();
