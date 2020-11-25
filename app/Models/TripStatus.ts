import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TripStatus extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public status: string;

  @column()
  public reasonToCancel: string;

  @column()
  public tripId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
