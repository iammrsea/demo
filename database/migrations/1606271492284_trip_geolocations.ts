import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TripGeolocations extends BaseSchema {
  protected tableName = 'trip_geolocations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.float('from_latitude');
      table.float('from_longitude');
      table.float('to_latitude');
      table.float('to_longitude');
      table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
