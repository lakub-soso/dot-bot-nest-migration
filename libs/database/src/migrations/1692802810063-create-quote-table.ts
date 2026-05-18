import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuoteTable1692802810063 implements MigrationInterface {
  name = 'CreateQuoteTable1692802810063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "twitch"."quote" ("id" uuid NOT NULL, "number" integer NOT NULL, "content" character varying NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_b772d4cb09e587c8c72a78d2439" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "twitch"."quote"`);
  }
}
