import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TripVehicleSpecs extends BaseSchema {
  protected tableName = 'trip_vehicle_specs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.boolean('is_carriage').defaultTo(false);
      table.enu('vehicle_type', ['keke', 'bike']);
      table.integer('number_of_seats');
      table.boolean('is_charter').defaultTo(false);
      table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE').onUpdate('CASCADE');
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
