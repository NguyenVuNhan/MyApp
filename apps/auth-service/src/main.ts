import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { environment } from './environments';
import { runInCluster } from '@app/shared/nest/utils';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const configService = app.get(ConfigService);

  const port = configService.get('PORT') || 3333;

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

if (environment.production) {
  runInCluster(bootstrap);
} else {
  bootstrap();
}
