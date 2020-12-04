import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Trips extends BaseSchema {
  protected tableName = 'trips'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.float('price').notNullable();
      table.float('distance').notNullable();
      table.string('from_address').notNullable();
      table.string('to_address').notNullable();
      table.integer('rider_id').references('id').inTable('riders').onDelete('CASCADE');
      table.integer('driver_id').references('id').inTable('drivers').onDelete('CASCADE');
      table.dateTime('started_at');
      table.dateTime('ended_at');
      table.string('lasted_for');
      table.dateTime('accepted_at');
      table.integer('rejections');
      table.integer('number_of_matches');
      table.boolean('previously_rejected').defaultTo(false);
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
