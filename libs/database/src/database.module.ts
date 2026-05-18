import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, AppConfigService } from '@app/config';
import { dataSourceOptions } from './datasource';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: (config: AppConfigService) => ({
                ...dataSourceOptions,
                host: config.database.host,
                port: config.database.port,
                username: config.database.user,
                password: config.database.password,
                database: config.database.name,
            }),
        }),
    ],
})
export class DatabaseModule {}
