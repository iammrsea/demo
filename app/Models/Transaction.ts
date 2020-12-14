import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Rider from './Rider';
import Driver from './Driver';

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public amountDeposited: number;

  @column()
  public amountWithdrawn: number;

  @column()
  public amountRemitted: number;

  @column()
  public transactionRef: string;

  @column()
  public riderId: number;

  @column()
  public driverId: number;

  @belongsTo(() => Rider)
  public rider: BelongsTo<typeof Rider>;

  @belongsTo(() => Driver)
  public driver: BelongsTo<typeof Driver>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
