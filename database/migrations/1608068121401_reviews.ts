import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Reviews extends BaseSchema {
  protected tableName = 'reviews'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('stars');
      table.text('comment');
      table.integer('trip_id').references('id').inTable('trips').onDelete('CASCADE');
      table.integer('rider_id').references('id').inTable('riders').onDelete('CASCADE');
      table.integer('driver_id').references('id').inTable('drivers').onDelete('CASCADE');
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
