import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1735573055818 implements MigrationInterface {
    name = 'SchemaUpdate1735573055818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`hobby\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`authorId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`hobby\` ADD CONSTRAINT \`FK_a176ec611867c96d551d325ed12\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`hobby\` DROP FOREIGN KEY \`FK_a176ec611867c96d551d325ed12\``);
        await queryRunner.query(`DROP TABLE \`hobby\``);
    }

}
