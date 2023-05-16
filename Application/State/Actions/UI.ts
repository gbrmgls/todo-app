import * as Types from "../../Commons/Types";
import Store from "../Store";

class UI {
  public async displayError(message: string) {
    Store.actionHandler({
      name: Types.Actions.UI.displayError,
      params: { message },
    });

    return true;
  }

  public async closeError() {
    Store.actionHandler({
      name: Types.Actions.UI.closeError,
      params: {},
    });

    return true;
  }
}

export default new UI();
