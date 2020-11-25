import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TripStatuses extends BaseSchema {
  protected tableName = 'trip_statuses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enu('status', ['pending', 'canceled', 'completed', 'intransit']);
      table.text('reason_to_cancel');
      table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
