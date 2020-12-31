import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Image from './Image';
import Address from './Address';
import Vehicle from './Vehicle';
import ProfileImage from './ProfileImage';
import User from './User';
import Message from './Message';
import Token from './Token';

export default class Driver extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public firstName?: string;

  @column({ serializeAs: null })
  public lastName?: string;

  @column()
  public fullName?: string;

  @column()
  public bvn: string;

  @column()
  public verified: boolean;

  @column()
  public suspended: boolean;

  @column({ serializeAs: null })
  public userId: number;

  @hasMany(() => Image)
  public documents: HasMany<typeof Image>;

  @hasOne(() => Address)
  public address: HasOne<typeof Address>;

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>;

  @hasOne(() => Vehicle)
  public vehicle: HasOne<typeof Vehicle>;

  @hasOne(() => ProfileImage)
  public profilePicture: HasOne<typeof ProfileImage>;

  @belongsTo(() => User)
  public userData: BelongsTo<typeof User>;

  @hasOne(() => Token)
  public token: HasOne<typeof Token>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime


}
