export default interface IEntity {
  toDTO(): any;
  fromDTO(dto: any): any;
}
