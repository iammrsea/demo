import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Vehicles extends BaseSchema {
  protected tableName = 'vehicles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('vehicle_type').notNullable();
      table.string('model_number').notNullable();
      table.string('plate_number').notNullable();
      table.string('color')
      table.integer('driver_id').references('id').inTable('drivers').onDelete('CASCADE').onUpdate('CASCADE');
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
