import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPassword1711874426821 implements MigrationInterface {
    name = 'AddPassword1711874426821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Identity\` ADD \`password\` varchar(300) NULL COMMENT '비밀번호'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Identity\` DROP COLUMN \`password\``);
    }

}
