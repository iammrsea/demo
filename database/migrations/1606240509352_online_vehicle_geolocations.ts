import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OnlineVehicleGeolocations extends BaseSchema {
  protected tableName = 'online_vehicle_geolocations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('latitude');
      table.string('longitude');
      table.integer('online_bike_id').references('id').inTable('online_bikes').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('online_tricycle_id').references('id').inTable('online_tricycles').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('addresss');
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
