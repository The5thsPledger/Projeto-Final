import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './exception.filter';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new CustomExceptionFilter());
  app.enableCors();
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  app.use(
    (
      req: { method: string; }, 
      res: { setHeader: (arg0: string, arg1: string) => void; sendStatus: (arg0: number) => any; }, 
      next: () => void
    ) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();
    }
);
  return app;
}


if (require.main === module) {
  bootstrap().then(async app => {
    await app.listen(process.env.APP_PORT ?? 3000);
  });
}
