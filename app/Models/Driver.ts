import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Image from './Image';
import Address from './Address';
import Vehicle from './Vehicle';
// import { CherryPick } from "@ioc:Adonis/Lucid/Model";
import ProfileImage from './ProfileImage';
import User from './User';

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

  @hasOne(() => Vehicle)
  public vehicle: HasOne<typeof Vehicle>;

  @hasOne(() => ProfileImage)
  public profilePicture: HasOne<typeof ProfileImage>;

  @belongsTo(() => User)
  public userData: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // public serialize(cheryPick?: CherryPick) {
  //   try {
  //     // console.log('this', this)
  //     return {
  //       ...this.serializeAttributes(cheryPick?.fields, false),
  //       ...this.serializeRelations(cheryPick?.relations, false),
  //       ...this.serializeComputed(cheryPick?.fields),
  //     };
  //   } catch (error) {
  //     console.log('error', error.response)
  //     throw error
  //   }
  // }
}
