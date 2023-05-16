import * as Types from "../../Commons/Types";
import { v4 as uuidv4 } from "uuid";

export default class ToDo {
  private id: string;
  private index: number;
  private value: string;
  private done: boolean;
  private createdAt: string;
  private updatedAt: string;

  constructor(
    id: string = crypto.randomUUID(),
    index: number = Date.now(),
    value = "",
    done = false,
    createdAt: string = Date.now().toString(),
    updatedAt: string = Date.now().toString()
  ) {
    this.id = id;
    this.index = index;
    this.value = value;
    this.done = done;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Converters
  public toDTO(): Types.DTOs.ToDo {
    return {
      id: this.id,
      index: this.index,
      value: this.value,
      done: this.done,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public static fromDTO(toDo: Types.DTOs.ToDo): ToDo {
    return new ToDo(
      "id" in toDo ? toDo.id : uuidv4(),
      "index" in toDo ? toDo.index : Date.now(),
      "value" in toDo ? toDo.value : "",
      "done" in toDo ? toDo.done : false,
      "createdAt" in toDo ? toDo.createdAt : Date.now().toString(),
      "updatedAt" in toDo ? toDo.updatedAt : Date.now().toString()
    );
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getIndex(): number {
    return this.index;
  }

  public getValue(): string {
    return this.value;
  }

  public getDone(): boolean {
    return this.done;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }

  // Setters
  public setIndex(index: number): void {
    this.updatedAt = Date.now().toString();
    this.index = index;
  }

  public setValue(value: string): void {
    this.updatedAt = Date.now().toString();
    this.value = value;
  }

  public setDone(done: boolean): void {
    this.updatedAt = Date.now().toString();
    this.done = done;
  }
}
