import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OnlineTricycles extends BaseSchema {
  protected tableName = 'online_tricycles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.boolean('in_transit').defaultTo(false);
      table.integer('available_seats').defaultTo(4);
      table.integer('trip_id').references('id').inTable('trips').onDelete('NO ACTION').onUpdate('NO ACTION')
      table.integer('driver_id').references('id').inTable('drivers').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('rejected_trip_id');
      table.boolean('is_online').defaultTo(false);
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
