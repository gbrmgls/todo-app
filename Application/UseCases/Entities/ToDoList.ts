import * as Types from "../../Commons/Types";
import { v4 as uuidv4 } from "uuid";

export default class ToDoList {
  private id: string;
  private index: number;
  private toDos: string[];
  private done: boolean;
  private createdAt: string;
  private updatedAt: string;

  constructor(
    id: string = crypto.randomUUID(),
    index: number = Date.now(),
    toDos: string[] = [],
    done = false,
    createdAt: string = Date.now().toString(),
    updatedAt: string = Date.now().toString()
  ) {
    this.id = id;
    this.index = index;
    this.toDos = toDos;
    this.done = done;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Converters
  public toDTO(): Types.DTOs.ToDoList {
    return {
      id: this.id,
      index: this.index,
      toDos: this.toDos,
      done: this.done,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public static fromDTO(toDoList: Types.DTOs.ToDoList): ToDoList {
    return new ToDoList(
      "id" in toDoList ? toDoList.id : uuidv4(),
      "index" in toDoList ? toDoList.index : Date.now(),
      "toDos" in toDoList ? toDoList.toDos : [],
      "done" in toDoList ? toDoList.done : false,
      "createdAt" in toDoList ? toDoList.createdAt : Date.now().toString(),
      "updatedAt" in toDoList ? toDoList.updatedAt : Date.now().toString()
    );
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getIndex(): number {
    return this.index;
  }

  public getToDos(): string[] {
    return this.toDos;
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

  public setToDos(toDos: string[]): void {
    this.updatedAt = Date.now().toString();
    this.toDos = toDos;
  }

  public setDone(done: boolean): void {
    this.updatedAt = Date.now().toString();
    this.done = done;
  }

  // Business Logic

  public addToDos(toDosIds: string[]): void {
    toDosIds.map((toDoId: string) => {
      if (!this.toDos.includes(toDoId)) {
        this.updatedAt = Date.now().toString();
        this.toDos.push(toDoId);
      }
    });
  }

  public removeToDos(toDosIds: string[]): void {
    toDosIds.map((toDoId: string) => {
      if (this.toDos.includes(toDoId)) {
        this.updatedAt = Date.now().toString();
        this.toDos = this.toDos.filter((toDo: string) => toDo != toDoId);
      }
    });
  }
}
