import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import TripGeolocation from './TripGeolocation';
import TripStatus from './TripStatus';
import TripVehicleSpec from './TripVehicleSpec';

export default class Trip extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public distance: number;

  @column()
  public fromAddress: string;

  @column()
  public toAddress: string;

  @column()
  public riderId: number;

  @column()
  public startAt: DateTime;

  @column()
  public endedAt: DateTime;

  @column()
  public lastedFor?: DateTime;

  @column()
  public price: number;

  @column()
  public driverId: number;

  @hasOne(() => TripGeolocation)
  public geolocation: HasOne<typeof TripGeolocation>;

  @hasOne(() => TripVehicleSpec)
  public vehicleSpecs: HasOne<typeof TripVehicleSpec>;

  @hasOne(() => TripStatus)
  public status: HasOne<typeof TripStatus>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
