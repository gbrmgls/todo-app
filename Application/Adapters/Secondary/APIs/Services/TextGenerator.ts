import * as APIDAOs from "../DAOs";

class TextGenerator {
  public async getQuote(): Promise<string> {
    return await APIDAOs.DummyJSON.Quote.get();
  }

  public async getPassword(): Promise<string> {
    return await APIDAOs.Randommer.Password.generate();
  }
}

export default new TextGenerator();
