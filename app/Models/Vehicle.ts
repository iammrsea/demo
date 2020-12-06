import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Driver from './Driver';

export default class Vehicle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public vehicleType: string;

  @column()
  public modelNumber: string;

  @column()
  public plateNumber: string;

  @column({ serializeAs: null })
  public driverId: number;

  @column()
  public color: string;

  @belongsTo(() => Driver)
  public owner: BelongsTo<typeof Driver>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
