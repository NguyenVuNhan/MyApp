import { AppValidationPipe } from '@app/api/shared/utils';
import { runInCluster } from '@app/shared/nest/utils';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { environment } from './environments';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new AppValidationPipe());

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
