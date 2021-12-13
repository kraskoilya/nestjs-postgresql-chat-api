import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './shared/socket/socket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  // app.useWebSocketAdapter(new IoAdapter(app));

  app.useWebSocketAdapter(new SocketIoAdapter(app, true));
  await app.listen(3000);
}
bootstrap();
