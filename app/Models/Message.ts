import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Reply from 'Contracts/Reply';
import Rider from './Rider';
import Driver from './Driver';

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public riderId: number;

  @column()
  public driverId: number;

  @column()
  public text: string;

  @column({
    prepare: (value) => JSON.stringify(value),
  })
  public messageReplies: Reply[];

  @belongsTo(() => Rider, { serializeAs: 'sender' })
  public rider: BelongsTo<typeof Rider>;

  @belongsTo(() => Driver, { serializeAs: 'sender' })
  public driver: BelongsTo<typeof Driver>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public addReply(reply: Reply) {
    if (!this.messageReplies.length) {
      this.messageReplies = [reply];
      return this.save()
    }
    this.messageReplies = [...this.messageReplies, reply];
    return this.save();
  }
  public removeReply(replyId: string) {
    const replies = this.messageReplies.filter(reply => reply.id !== replyId);
    this.messageReplies = [...replies];
    return this.save();
  }
}
