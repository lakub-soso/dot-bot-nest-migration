import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePPResponseAssignmentTable1722019203868
  implements MigrationInterface
{
  name = 'CreatePPResponseAssignmentTable1722019203868';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "twitch"."pp_response_assignment" ("user_id" uuid NOT NULL, "response_id" uuid NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_464cfe2e788e985011a8afbd0f3" PRIMARY KEY ("user_id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "twitch"."pp_response_assignment"`);
  }
}
