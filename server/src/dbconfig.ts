export default {
  type: 'postgres',
  host: '0.0.0.0',
  port: 5432,
  username: 'technical',
  password: 'technical',
  database: 'technical',
  entities: [__dirname + '/entities/*.ts'],
  migrations: [__dirname + '/migrations/*.ts'],
  cli: {
    migrationsDir: 'migrations',
  },
}
