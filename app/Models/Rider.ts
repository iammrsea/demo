import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import ProfileImage from './ProfileImage';
import User from './User';
import Wallet from './Wallet';
import Message from './Message';
import Token from './Token';

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

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>;

  @belongsTo(() => User)
  public userData: BelongsTo<typeof User>;

  @hasOne(() => Wallet)
  public wallet: HasOne<typeof Wallet>;

  @hasOne(() => Token)
  public token: HasOne<typeof Token>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
