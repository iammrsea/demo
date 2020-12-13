import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Rider from './Rider';
import User from './User';

export default class Wallet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public balance: number;

  @column()
  public riderId: number;

  @column()
  public userId: number;

  @column()
  public cummulativeAmount: number;

  @belongsTo(() => Rider)
  public rider: BelongsTo<typeof Rider>;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public hasSufficientBalance(amount): boolean {
    return this.balance >= amount;
  }
  public addMoney(amount): Promise<Wallet> {
    this.balance ? this.balance += amount : this.balance = amount;
    this.cummulativeAmount ? this.cummulativeAmount += amount : this.cummulativeAmount = amount;
    return this.save();
  }
  public removeMoney(amount): Promise<Wallet> {
    this.balance -= amount;
    return this.save();
  }
}
