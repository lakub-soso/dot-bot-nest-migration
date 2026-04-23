import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "./typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [
                ConfigModule,
            ],
            inject: [
                ConfigService,
            ],
            useFactory: async (
                configService: ConfigService,
            ) =>
            {
                const typeormConfig = config;

                const password = configService.get('DB_PASSWORD');

                typeormConfig.password = password;

                return typeormConfig as any;
            }
        })
    ],
})
export class DbModule
{

}