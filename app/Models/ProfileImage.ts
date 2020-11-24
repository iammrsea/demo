import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Rider from './Rider';
import Driver from './Driver';

export default class ProfileImage extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public url: string;

  @column()
  public fileId: string;

  @column()
  public thumbnailUrl?: string;

  @column({serializeAs:null})
  public driverId?: number;

  @column({serializeAs:null})
  public riderId?: number;

  @belongsTo(() => Rider)
  public rider: BelongsTo<typeof Rider>;

  @belongsTo(() => Driver)
  public driver: BelongsTo<typeof Driver>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
