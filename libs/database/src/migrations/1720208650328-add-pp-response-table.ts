import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPPResponseTable1720208650328 implements MigrationInterface {
  name = 'AddPPResponseTable1720208650328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "twitch"."pp_response" ("id" uuid NOT NULL, "content" character varying NOT NULL, "verified" boolean NOT NULL, CONSTRAINT "PK_0e8515264a95a155033dedd1ea4" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "twitch"."pp_response"`);
  }
}
