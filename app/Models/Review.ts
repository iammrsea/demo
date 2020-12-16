import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Trip from './Trip';
import Rider from './Rider';
import Driver from './Driver';

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public stars: number;

  @column()
  public comment: string;

  @column()
  public tripId: number;

  @column()
  public riderId: number;

  @column()
  public driverId: number;


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Trip)
  public trip: BelongsTo<typeof Trip>;

  @belongsTo(() => Rider, { serializeAs: 'reviewer' })
  public rider: BelongsTo<typeof Rider>;

  @belongsTo(() => Driver, { serializeAs: 'reviewer' })
  public driver: BelongsTo<typeof Driver>;
}
