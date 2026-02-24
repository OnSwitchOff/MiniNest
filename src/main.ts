import "reflect-metadata";
import {Application} from "./framework/application";
import {AppController} from "./app/app.controller";
import {container} from "./framework/container";
import {AppService, ConfigService} from "./app/app.service";
import {AppModule} from "./app/app.module";
import {TrimPipe} from "./app/pipes/trimPipe";
import {EmptyStringToUndefinedPipe} from "./app/pipes/emptyStringToUndefinedPipe";

async function bootstrap() {
    const app = new Application();
    app.useGlobalPipes(
        TrimPipe,
        EmptyStringToUndefinedPipe
    );
    app.registerModule(AppModule);

    await app.listen(3000);
    console.log("Server started on http://localhost:3000");
}

bootstrap();