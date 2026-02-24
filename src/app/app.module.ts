import {AppService, ConfigService} from "./app.service";
import {AppController} from "./app.controller";
import {Module} from "../framework/decorators/module";
import {UsersModule} from "./users/users.module";

@Module({
    providers: [AppService, ConfigService],
    controllers: [AppController],
    imports: [UsersModule]
})
export class AppModule {}