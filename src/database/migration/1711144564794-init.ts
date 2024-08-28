import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1711144564794 implements MigrationInterface {
  name = 'Init1711144564794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Identity\` (\`id\` int NOT NULL AUTO_INCREMENT, \`provider_type\` varchar(255) NOT NULL COMMENT '소셜 로그인 타입', \`identifier\` varchar(255) NOT NULL, \`email\` varchar(255) NULL COMMENT '이메일', \`user_id\` int NULL COMMENT '사용자 ID', \`created_at\` datetime(6) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="Identity"`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Book\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(100) NOT NULL COMMENT '제목', \`author\` varchar(100) NOT NULL COMMENT '저자', \`pubDate\` varchar(30) NOT NULL COMMENT '출판일', \`desc\` text NULL COMMENT '설명', \`isbn\` varchar(100) NOT NULL COMMENT 'ISBN', \`isbn13\` varchar(100) NOT NULL COMMENT 'ISBN13', \`publisher\` varchar(100) NOT NULL COMMENT '출판사', \`cover\` varchar(500) NULL COMMENT '도서 이미지 URL', \`created_at\` datetime(6) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6fa3b62dd8b04061475bb006b4\` (\`isbn\`), UNIQUE INDEX \`IDX_fa36ac0554b0260bf30c23e5d7\` (\`isbn13\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="도서"`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Essay\` (\`id\` int NOT NULL AUTO_INCREMENT, \`bookshelf_id\` int NOT NULL COMMENT '책장 ID', \`content\` text NULL COMMENT '내용', \`created_at\` datetime(6) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '최근 수정일' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`REL_bfb0bf4acaf11ee8cff31d1fb6\` (\`bookshelf_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="에세이"`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Memo\` (\`id\` int NOT NULL AUTO_INCREMENT, \`bookshelf_id\` int NOT NULL COMMENT '책장 ID', \`page\` int NOT NULL COMMENT '페이지', \`content\` text NULL COMMENT '내용', \`created_at\` datetime(6) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="메모"`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Bookshelf\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL COMMENT '사용자 ID', \`book_id\` int NOT NULL COMMENT '도서 ID', \`created_at\` datetime(6) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="책장"`,
    );
    await queryRunner.query(
      `CREATE TABLE \`User\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL COMMENT '이름', \`created_at\` datetime(6) NOT NULL COMMENT '생성일' DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL COMMENT '수정일' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT="유저"`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Identity\` ADD CONSTRAINT \`FK_7aa096e28afeb7c7d20ee8c62d7\` FOREIGN KEY (\`user_id\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Essay\` ADD CONSTRAINT \`FK_bfb0bf4acaf11ee8cff31d1fb6c\` FOREIGN KEY (\`bookshelf_id\`) REFERENCES \`Bookshelf\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Memo\` ADD CONSTRAINT \`FK_7c21e0a16bdf5a94dfae6f66f98\` FOREIGN KEY (\`bookshelf_id\`) REFERENCES \`Bookshelf\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Bookshelf\` ADD CONSTRAINT \`FK_c631162d9dc7d42e0ce9d05bc9e\` FOREIGN KEY (\`user_id\`) REFERENCES \`User\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Bookshelf\` ADD CONSTRAINT \`FK_514f3e2bde55f9280aeba624fdd\` FOREIGN KEY (\`book_id\`) REFERENCES \`Book\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE \`query-result-cache\` (\`id\` int NOT NULL AUTO_INCREMENT, \`identifier\` varchar(255) NULL, \`time\` bigint NOT NULL, \`duration\` int NOT NULL, \`query\` text NOT NULL, \`result\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`query-result-cache\``);
    await queryRunner.query(
      `ALTER TABLE \`Bookshelf\` DROP FOREIGN KEY \`FK_514f3e2bde55f9280aeba624fdd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Bookshelf\` DROP FOREIGN KEY \`FK_c631162d9dc7d42e0ce9d05bc9e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Memo\` DROP FOREIGN KEY \`FK_7c21e0a16bdf5a94dfae6f66f98\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Essay\` DROP FOREIGN KEY \`FK_bfb0bf4acaf11ee8cff31d1fb6c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Identity\` DROP FOREIGN KEY \`FK_7aa096e28afeb7c7d20ee8c62d7\``,
    );
    await queryRunner.query(`DROP TABLE \`User\``);
    await queryRunner.query(`DROP TABLE \`Bookshelf\``);
    await queryRunner.query(`DROP TABLE \`Memo\``);
    await queryRunner.query(
      `DROP INDEX \`REL_bfb0bf4acaf11ee8cff31d1fb6\` ON \`Essay\``,
    );
    await queryRunner.query(`DROP TABLE \`Essay\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_fa36ac0554b0260bf30c23e5d7\` ON \`Book\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_6fa3b62dd8b04061475bb006b4\` ON \`Book\``,
    );
    await queryRunner.query(`DROP TABLE \`Book\``);
    await queryRunner.query(`DROP TABLE \`Identity\``);
  }
}
