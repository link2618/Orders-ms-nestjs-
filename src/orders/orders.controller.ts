import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { OrdersService } from './orders.service';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { CreateOrderDto, ChangeOrderStatusDto, PaidOrderDto } from './dto';

@Controller()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @MessagePattern('createOrder')
    async create(@Payload() createOrderDto: CreateOrderDto) {
        const order = await this.ordersService.create(createOrderDto);
        const paymentSession = await this.ordersService.createPaymentSession(
            order,
        );

        return {
            order,
            paymentSession,
        };
    }

    @MessagePattern('findAllOrders')
    findAll(@Payload() orderPaginationDto: OrderPaginationDto) {
        return this.ordersService.findAll(orderPaginationDto);
    }

    @MessagePattern('findOneOrder')
    findOne(@Payload('id', ParseUUIDPipe) id: string) {
        return this.ordersService.findOne(id);
    }

    @MessagePattern('changeOrderStatus')
    changeOrderStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto) {
        console.log(changeOrderStatusDto);
        return this.ordersService.changeStatus(changeOrderStatusDto);
    }

    @EventPattern('payment.succeeded')
    paidOrder(@Payload() paidOrderDto: PaidOrderDto) {
        return this.ordersService.paidOrder(paidOrderDto);
    }
}
