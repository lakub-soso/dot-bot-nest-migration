import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLoveAssignmentTable1736541120791 implements MigrationInterface {
  name = 'CreateLoveAssignmentTable1736541120791';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "twitch"."love_assignment" ("id" uuid NOT NULL, "lover" character varying NOT NULL, "loved" character varying NOT NULL, "value" integer NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_32d4b673259a43261e23e7d142b" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "twitch"."love_assignment"`);
  }
}
