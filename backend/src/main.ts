import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { APP_URL, PORT } from "./app.constants";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: APP_URL, credentials: true });
    app.use(cookieParser());

    const config = new DocumentBuilder()
        .setTitle("Notaros API")
        .setDescription("The Notaros API description")
        .setVersion("0.1")
        .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "jwt" })
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    await app.listen(PORT);
}
bootstrap();
