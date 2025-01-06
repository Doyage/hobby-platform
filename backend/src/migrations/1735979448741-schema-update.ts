import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1735979448741 implements MigrationInterface {
    name = 'SchemaUpdate1735979448741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`chat\` (\`id\` int NOT NULL AUTO_INCREMENT, \`message\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`hobbyId\` int NULL, \`authorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_72df325098c49077833c077cb94\` FOREIGN KEY (\`hobbyId\`) REFERENCES \`hobby\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_ac7ca6f6fbe56f2a231369f2171\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_ac7ca6f6fbe56f2a231369f2171\``);
        await queryRunner.query(`ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_72df325098c49077833c077cb94\``);
        await queryRunner.query(`DROP TABLE \`chat\``);
    }

}
