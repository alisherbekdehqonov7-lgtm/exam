import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix("api");

  // CORS — allow frontend origins
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:4200",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle("BookHaven API")
    .setDescription(
      "BookHaven Online Bookstore REST API — auth, books, authors, reviews, cart, favorites, notifications va search modullari.",
    )
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT tokenni shu yerga kiriting",
      },
      "JWT-auth",
    )
    .addTag("Auth", "Ro'yxatdan o'tish, login, profil")
    .addTag("Users", "Foydalanuvchi profili va admin boshqaruvi")
    .addTag("Books", "Kitoblar CRUD, filter, sort, pagination")
    .addTag("Authors", "Mualliflar CRUD va follow")
    .addTag("Favorites", "Sevimli kitoblar")
    .addTag("Reviews", "Kitoblarga sharhlar")
    .addTag("Cart", "Savatcha va checkout")
    .addTag("Search", "Kitob va mualliflar bo'yicha qidiruv")
    .addTag("Notifications", "Foydalanuvchi bildirishnomalari")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
    },
  });

  const PORT = process.env.PORT || 3001;
  await app.listen(PORT);

  console.log(`
  ╔══════════════════════════════════════════════╗
  ║     🍃 BookHaven API is running!             ║
  ║     📍 http://localhost:${PORT}/api            ║
  ║     📚 Swagger:  /api/docs                   ║
  ╚══════════════════════════════════════════════╝
  `);
}

bootstrap();
