import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Rider from './Rider'
import Driver from './Driver'
import Token from './Token'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public phoneNumber: string

  @column()
  public role: string;

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken?: string

  @hasOne(() => Rider, { serializeAs: 'profile' })
  public rider: HasOne<typeof Rider>;

  @hasOne(() => Driver, { serializeAs: 'profile' })
  public driver: HasOne<typeof Driver>;

  @hasOne(() => Token)
  public token: HasOne<typeof Token>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
