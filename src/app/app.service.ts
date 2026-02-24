import {Injectable} from "../framework/decorators/injectable";
import {Inject} from "../framework/decorators/inject";

@Injectable()
export class ConfigService {
    get(key: string) { return `value-of-${key}`; }
}

@Injectable()
export class AppService {
    constructor(@Inject(ConfigService) private config: ConfigService) {}
    showPort(): string { return this.config.get("PORT") }
}