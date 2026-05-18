import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNameToUser1719261898997 implements MigrationInterface {
  name = 'AddNameToUser1719261898997';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "twitch"."user" ADD "name" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "twitch"."user" DROP COLUMN "name"`);
  }
}
