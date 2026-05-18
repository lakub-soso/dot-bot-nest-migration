import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTwitchSchema1692802667781 implements MigrationInterface {
  name = 'CreateTwitchSchema1692802667781';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA "twitch"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA "twitch"`);
  }
}
