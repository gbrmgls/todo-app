import * as Clients from "../../Clients";

class Text {
  private APIData: any = Clients.DummyJSON.getAPIData();

  public async get(): Promise<string> {
    const response = await fetch(`${this.APIData.host}/quotes/random`, {
      method: "GET",
    }).then((res) => res.json());

    return response.quote;
  }
}

export default new Text();
