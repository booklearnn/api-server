import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteUser1712664164882 implements MigrationInterface {
    name = 'DeleteUser1712664164882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` ADD \`deleted_at\` datetime(6) NULL COMMENT '삭제일(탈퇴일)'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`User\` DROP COLUMN \`deleted_at\``);
    }

}
