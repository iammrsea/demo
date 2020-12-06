import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OnlineBikes extends BaseSchema {
  protected tableName = 'online_bikes'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign(['trip_id'])
      table.foreign('trip_id').references('trips.id')
        .onDelete('SET DEFAULT').onUpdate('NO ACTION')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign(['trip_id'])
      table.foreign('trip_id').references('trips.id')
        .onDelete('NO ACTION').onUpdate('NO ACTION')

    })
  }
}
