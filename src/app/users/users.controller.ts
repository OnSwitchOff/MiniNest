import {Controller} from "../../framework/decorators/controller";
import {UserService} from "./users.service";
import {Get, Post} from "../../framework/decorators/routes";
import {Body, Param, Query} from "../../framework/decorators/param";
import {Inject} from "../../framework/decorators/inject";
import {UsePipe} from "../../framework/decorators/use-pipe";
import {StringToNumberPipe} from "../pipes/string-to-number.pipe";
import {ZodValidationPipe} from "../pipes/zod.pipe";
import {createUserSchema} from "./users.schema";

@Controller("users")
export class UserController {
    constructor(@Inject(UserService) private userService: UserService) {}

    @Get("/:id")
    getUser(@Param('id', StringToNumberPipe) id: number) {
        return this.userService.findUserById(id.toString());
    }

    @Get("/")
    searchUsers(@Query("name") name: string) {
        return this.userService.searchByName(name);
    }

    @Post("/")
    createUser(@Body(new ZodValidationPipe(createUserSchema)) body: { name: string }) {
        return this.userService.createUser(body.name);
    }
}