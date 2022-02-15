import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm'

export class CardSubtasksMigration1644762721993 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'cards',
      new TableColumn({ name: 'parent_id', type: 'int', isNullable: true })
    )
    await queryRunner.createForeignKey(
      'cards',
      new TableForeignKey({
        columnNames: ['parent_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'cards',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('cards')
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.includes('parent_id'))
    await queryRunner.dropForeignKey('cards', foreignKey)
    await queryRunner.dropColumn('cards', 'parent_id')
  }
}
