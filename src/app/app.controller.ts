import {Controller} from "../framework/decorators/controller";
import {Get} from "../framework/decorators/routes";
import {AppService} from "./app.service";
import {Inject} from "../framework/decorators/inject";


@Controller("app")
export class AppController {
    constructor(@Inject(AppService) private appService: AppService) {
        console.log("AppController",this);
    }
    @Get("/")
    getHello() {
        return "Hello from Controller 🎯";
    }

    @Get("/port")
    showPort() {
        return this.appService.showPort();
    }
}