import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndWealthTables1708724126227
  implements MigrationInterface
{
  name = 'CreateUserAndWealthTables1708724126227';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "twitch"."wealth" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "value" integer NOT NULL, "userId" uuid, CONSTRAINT "REL_0ab7b20a87c3f9f5ea4fa14339" UNIQUE ("userId"), CONSTRAINT "PK_8b40b1efa87e8e6abb48c106668" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "twitch"."user" ("id" uuid NOT NULL, "external_id" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "twitch"."wealth" ADD CONSTRAINT "FK_0ab7b20a87c3f9f5ea4fa14339d" FOREIGN KEY ("userId") REFERENCES "twitch"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "twitch"."wealth" DROP CONSTRAINT "FK_0ab7b20a87c3f9f5ea4fa14339d"`,
    );
    await queryRunner.query(`DROP TABLE "twitch"."user"`);
    await queryRunner.query(`DROP TABLE "twitch"."wealth"`);
  }
}
