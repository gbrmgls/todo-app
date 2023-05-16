export default interface IClient {
  watchChanges(): Promise<void>;
  subscribe(callback: any): Promise<void>;
  unsubscribe(callback: any): Promise<void>;
}
