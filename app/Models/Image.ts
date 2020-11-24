import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Image extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public url: string;

  @column()
  public fileId: string;

  @column({serializeAs:null})
  public driverId: number;

  @column()
  public thumbnailUrl?: string;
  
  @column()
  public description?: string;

  @column()
  public documentType?: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
