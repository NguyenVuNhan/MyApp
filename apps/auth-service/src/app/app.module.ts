import { PostgresTypeOrmDatabaseModule } from '@app/shared/nest/modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';

@Module({
  imports: [
    PostgresTypeOrmDatabaseModule,
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '.env'),
      validationSchema: Joi.object({
        // App config
        PORT: Joi.number(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        // Postgres
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
