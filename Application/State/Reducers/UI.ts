import * as Types from "../../Commons/Types";

const UI = {
  [Types.Actions.UI.displayError]: async (
    state: any,
    message: string
  ): Promise<Types.State> => {
    state.error = {
      message,
      show: true,
    };

    return state;
  },

  [Types.Actions.UI.closeError]: async (state: any): Promise<Types.State> => {
    state.error.show = false;

    return state;
  },
};

export default UI;
