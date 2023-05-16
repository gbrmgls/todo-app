import * as Clients from "../../Clients";

class Password {
  private APIData: any = Clients.Randommer.getAPIData();

  public async generate(): Promise<string> {
    const response = await fetch(
      `${this.APIData.host}/Text/Password?length=20&hasDigits=true&hasUppercase=true&hasSpecial=true`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": this.APIData.apiKey,
        },
      }
    ).then((res) => res.json());

    return response;
  }
}

export default new Password();
