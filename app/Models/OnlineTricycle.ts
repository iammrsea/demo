import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import OnlineVehicleGeolocation from './OnlineVehicleGeolocation';
import Driver from './Driver';
import Trip from './Trip';

export default class OnlineTricycle extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public inTransit: boolean;

  @column()
  public driverId: number;

  @column()
  public isOnline: boolean;

  @column()
  public rejectedTripId: number;

  @column({ serializeAs: null })
  public tripId: number;

  @column()
  public availableSeats: number

  @hasOne(() => OnlineVehicleGeolocation)
  public geolocation: HasOne<typeof OnlineVehicleGeolocation>;

  @belongsTo(() => Driver)
  public driver: BelongsTo<typeof Driver>;

  @belongsTo(() => Trip)
  public trip: BelongsTo<typeof Trip>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
