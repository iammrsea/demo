import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TripGeolocation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public latitude: string;

  @column()
  public longitude: string;

  @column()
  public tripId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
