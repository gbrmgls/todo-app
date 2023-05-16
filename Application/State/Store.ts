import * as Types from "../Commons/Types";
import * as Actions from "./Actions";
import ReducerCombiner from "./Reducers/ReducerCombiner";

class Store {
  // Singleton logic
  private static instance: Store;
  private constructor() {
    // Do nothing
  }

  public static getInstance() {
    if (!Store.instance) {
      Store.instance = new Store();
      Actions.ToDo.get();
      Actions.ToDoList.get();
    }
    return Store.instance;
  }
  // ----------

  // Observer pattern logic
  private subscriptions: any = [];
  private subscriptionsOnce: any = [];

  public subscribeOnce(subscriber: any) {
    this.subscriptionsOnce.push(subscriber);
  }

  public subscribe(subscriber: any) {
    this.subscriptions.push(subscriber);
  }

  public unsubscribe(subscriber: any) {
    this.subscriptions = this.subscriptions.filter(
      (subscription: any) => subscription !== subscriber
    );
  }

  public dispatch(action: any) {
    // Emmit once and delete subscription
    this.subscriptionsOnce.map((subscription: any) => {
      subscription(action);
      this.subscriptionsOnce = this.subscriptionsOnce.filter(
        (subscription: any) => subscription != subscription
      );
    });

    // Emmit subscription and keep listening
    this.subscriptions.map((subscription: any) => {
      subscription(action);
    });
  }
  // ----------

  private state: Types.State = {
    toDos: [],
    toDoLists: [],
    error: {
      show: false,
      message: "",
    },
  };

  public getState = () => {
    return this.state;
  };

  public actionHandler = async (action: any) => {
    // Calls action if exists
    if (Object.keys(ReducerCombiner).includes(action.name)) {
      // Run action passing action parameters as arguments and receive new state
      this.state = await ReducerCombiner[action.name](
        this.state,
        ...Object.values(action.params)
      );

      // Update all subscribed observers with new state
      this.dispatch({ ...this.state });
    }
  };
}

export default Store.getInstance();
