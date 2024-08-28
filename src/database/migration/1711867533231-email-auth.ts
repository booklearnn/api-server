import { MigrationInterface, QueryRunner } from 'typeorm';

export class EmailAuth1711867533231 implements MigrationInterface {
  name = 'EmailAuth1711867533231';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`EmailAuth\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(300) NOT NULL COMMENT '이메일', \`code\` varchar(6) NOT NULL COMMENT '인증 코드', \`isCertified\` tinyint NOT NULL COMMENT '인증 여부' DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`EmailAuth\``);
  }
}
