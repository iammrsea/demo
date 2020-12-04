import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import TripGeolocation from './TripGeolocation';
import TripStatus from './TripStatus';
import TripVehicleSpec from './TripVehicleSpec';
import Driver from './Driver';
import Rider from './Rider';

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
  public startedAt: DateTime;

  @column()
  public endedAt: DateTime;

  @column()
  public lastedFor?: string;

  @column()
  public price: number;

  @column()
  public driverId: number;

  @column()
  public numberOfMatches: number;

  @column()
  public rejections: number;

  @column()
  public previouslyRejected: boolean;

  @column()
  public acceptedAt: DateTime;

  @hasOne(() => TripGeolocation)
  public geolocation: HasOne<typeof TripGeolocation>;

  @hasOne(() => TripVehicleSpec)
  public vehicleSpecs: HasOne<typeof TripVehicleSpec>;

  @hasOne(() => TripStatus)
  public status: HasOne<typeof TripStatus>;

  @belongsTo(() => Driver)
  public driver: BelongsTo<typeof Driver>;

  @belongsTo(() => Rider)
  public rider: BelongsTo<typeof Rider>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
