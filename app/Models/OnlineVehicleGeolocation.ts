import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class OnlineVehicleGeolocation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public latitude: string;

  @column()
  public longitude: string;

  @column()
  public onlineBikeId: number;

  @column()
  public onlineTricycleId: number;

  @column()
  public address?: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
