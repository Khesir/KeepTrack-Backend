import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

const server = express();
let isReady = false;

async function bootstrap() {
  if (isReady) return server;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn', 'log'],
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // ── CORS ──────────────────────────────────────────────────────────────────
  const configService = app.get(ConfigService);
  const rawOrigins = configService.get<string>('ALLOWED_ORIGINS') ?? '*';
  const allowedOrigins = rawOrigins.split(',').map((o) => o.trim());

  app.enableCors({
    origin: (origin, callback) => {
      // No origin = mobile app / curl / Postman — always allow
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ── Global pipes & filters ────────────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // ── Swagger (non-production only) ─────────────────────────────────────────
  const env = configService.get<string>('NODE_ENV') ?? 'production';
  if (env !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Personal Codex API')
      .setDescription('Personal finance & productivity API')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    Logger.log('Swagger docs → /docs');
  }

  await app.init();
  isReady = true;

  // In local dev, also start the HTTP server
  if (env !== 'production') {
    const port = configService.get<string>('PORT') ?? '3000';
    await app.listen(port);
    Logger.log(`API running on http://localhost:${port}/api/v1 (v2 → /api/v2)`);
  }

  return server;
}

// ── Vercel serverless entry point ─────────────────────────────────────────────
export default async (req: IncomingMessage, res: ServerResponse) => {
  const handler = await bootstrap();
  handler(req, res);
};

// ── Local dev entry point (called by nest start) ──────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  bootstrap().catch((err) => {
    Logger.error('Bootstrap failed', err);
    process.exit(1);
  });
}
