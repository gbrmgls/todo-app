export default interface IService {
  subscribe(callback: any): Promise<void>;
  unsubscribe(callback: any): Promise<void>;
  get(options?: any): Promise<any>;
  create(dto: any): Promise<any>;
  update(dto: any, dtosIds?: string[]): Promise<any>;
  delete(dtosIds: string[]): Promise<boolean>;
}
