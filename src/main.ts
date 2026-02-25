import "reflect-metadata";
import {Application} from "./framework/application";
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

bootstrap().then(_ => { console.log("then"); });