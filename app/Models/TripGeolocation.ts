import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TripGeolocation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fromLatitude: number;

  @column()
  public toLatitude: number;

  @column()
  public fromLongitude: number;

  @column()
  public toLongitude: number;

  @column()
  public tripId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public serialize() {
    return {
      fromLocation: { latitude: this.fromLatitude, longitude: this.fromLongitude },
      toLocation: { latitude: this.toLatitude, longitude: this.toLongitude }
    }
  }
}
