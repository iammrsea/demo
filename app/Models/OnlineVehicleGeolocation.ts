import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
// import { CherryPick } from '@ioc:Adonis/Lucid/Model';

export default class OnlineVehicleGeolocation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public latitude: number;

  @column()
  public longitude: number;

  @column()
  public onlineBikeId: number;

  @column()
  public onlineTricycleId: number;

  @column()
  public address?: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public serialize() {
    return {
      latitude: +this.latitude, longitude: +this.longitude,
      address: this.address
    };

  }
}
