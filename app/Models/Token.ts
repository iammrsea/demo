import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class Token extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public token: string;

  @column()
  public riderId: number;

  @column()
  public driverId: number;

  @column()
  public userId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

}
