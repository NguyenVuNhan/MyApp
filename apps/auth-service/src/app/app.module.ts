import { PostgresTypeOrmDatabaseModule } from '@app/shared/nest/modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { join } from 'path';
import { User, Avatar } from '@app/user/shared';
import { AuthenticationModule } from '@app/authentication/module';

@Module({
  imports: [
    PostgresTypeOrmDatabaseModule.registerEntities([User, Avatar]),
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '.env'),
      validationSchema: Joi.object({
        // App config
        PORT: Joi.number(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        BASE_URL: Joi.string().required(),
        // 2FA
        TWO_FACTOR_AUTHENTICATION_APP_NAME: Joi.string().required(),
        // JWT
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        // Oauth2 google
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        // Oauth2 facebook
        FACEBOOK_CLIENT_ID: Joi.string().required(),
        FACEBOOK_CLIENT_SECRET: Joi.string().required(),
        // Postgres
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
