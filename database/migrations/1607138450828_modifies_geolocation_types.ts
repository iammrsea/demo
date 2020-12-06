import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TripGeolocations extends BaseSchema {
  protected tableName = 'trip_geolocations'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.double('from_latitude').alter();
      table.double('from_longitude').alter();
      table.double('to_latitude').alter();
      table.double('to_longitude').alter();
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.float('from_latitude');
      table.float('from_longitude');
      table.float('to_latitude');
      table.float('to_longitude');
    })
  }
}
