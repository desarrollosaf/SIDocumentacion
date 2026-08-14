"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.setGlobalPrefix(config.get('apiPrefix', 'api'));
    app.enableCors({
        origin: config.get('corsOrigin', ['http://localhost:4200']),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: false, transform: true }));
    await app.listen(config.get('port', 3000));
}
void bootstrap();
//# sourceMappingURL=main.js.map