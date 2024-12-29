import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueryFailedFilter } from './module/filter/query-failed.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new QueryFailedFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
