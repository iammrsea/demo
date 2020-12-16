/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { OrmConfig } from '@ioc:Adonis/Lucid/Orm'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application';

const databaseConfig: DatabaseConfig & { orm: Partial<OrmConfig> } = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get('DB_CONNECTION'),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | PostgreSQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for PostgreSQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i pg
    |
    */
    pg: {
      client: 'pg',
      //  connection: !Application.inProduction
      //   ? Env.get("DATABASE_URL") + "?ssl=no-verify"
      //   : {
      //       host: Env.get("DB_HOST", "127.0.0.1") as string,
      //       port: Number(Env.get("DB_PORT", 5432)),
      //       user: Env.get("DB_USER", "lucid") as string,
      //       password: Env.get("DB_PASSWORD", "lucid") as string,
      //       database: Env.get("DB_NAME", "lucid") as string,
      //     },
      // connection: Application.inProduction || Application.nodeEnvironment === 'testing' ?
      //   Env.get('DATABASE_URL') + "?ssl=no-verify" :
      //   {
      //     host: Env.get('PG_HOST'),
      //     port: Env.get('PG_PORT'),
      //     user: Env.get('PG_USER'),
      //     password: Env.get('PG_PASSWORD', ''),
      //     database: Env.get('PG_DB_NAME'),
      //   },
      connection: Application.inProduction ?
        Env.get('DATABASE_URL') + "?ssl=no-verify" :
        {
          host: Env.get('PG_HOST'),
          port: Env.get('PG_PORT'),
          user: Env.get('PG_USER'),
          password: Env.get('PG_PASSWORD', ''),
          database: Env.get('PG_DB_NAME'),
        },

      healthCheck: Application.inDev,
      debug: Application.inDev,
    },
    custom: {
      client: "pg",
      connection: Env.get("DATABASE_URL") + "?ssl=no-verify",
    },
    staging: {
      client: "pg",
      connection: Env.get("DATABASE_URL_STAGING") + "?ssl=no-verify",
    },
    production: {
      client: "pg",
      connection: Env.get("DATABASE_URL_PROD") + "?ssl=no-verify",
    },

  },

  /*
  |--------------------------------------------------------------------------
  | ORM Configuration
  |--------------------------------------------------------------------------
  |
  | Following are some of the configuration options to tweak the conventional
  | settings of the ORM. For example:
  |
  | - Define a custom function to compute the default table name for a given model.
  | - Or define a custom function to compute the primary key for a given model.
  |
  */
  orm: {
  },
}

export default databaseConfig
