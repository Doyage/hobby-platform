import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueryFailedFilter } from './module/filter/query-failed.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new QueryFailedFilter());

  // const corsOptions: CorsOptions = {
  //   origin: '*',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // };
  // app.enableCors(corsOptions);

  // app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
