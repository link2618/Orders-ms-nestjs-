import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { envs, PRODUCT_SERVICE } from 'src/config';

@Module({
    controllers: [OrdersController],
    providers: [OrdersService],
    imports: [
        ClientsModule.register([
            {
                name: PRODUCT_SERVICE,
                transport: Transport.TCP,
                options: {
                    host: envs.productsMicroserviceHost,
                    port: envs.productsMicroservicePort,
                },
            },
        ]),
    ],
})
export class OrdersModule {}
