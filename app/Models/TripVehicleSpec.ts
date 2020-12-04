import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Image from './Image';

export default class TripVehicleSpec extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public isCarriage?: boolean;

  @column()
  public isCharter?: boolean;

  @column()
  public numberOfSeats?: number;

  @column()
  public vehicleType: string;

  @column()
  public tripId: number;

  @hasMany(() => Image)
  public luggagePictures: HasMany<typeof Image>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
