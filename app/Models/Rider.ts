import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import ProfileImage from './ProfileImage';
import User from './User';

export default class Rider extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public userId: number;

  @column()
  public firstName?: string;

  @column()
  public lastName?: string;

  @column()
  public address?: string;

  @column()
  public fullName?: string;

  @column()
  public bvn: string;

  @hasOne(() => ProfileImage)
  public profilePicture: HasOne<typeof ProfileImage>;

  @belongsTo(() => User)
  public userData: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
