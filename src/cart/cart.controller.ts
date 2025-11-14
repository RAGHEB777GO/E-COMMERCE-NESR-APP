import { Controller, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto } from './cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Body() body: AddToCartDto & { userId: string }) {
    return this.cartService.addToCart(body.userId, body);
  }

  @Patch('update')
  updateQuantity(@Body() body: UpdateCartDto & { userId: string }) {
    return this.cartService.updateQuantity(body.userId, body);
  }

  @Delete('remove/:userId/:productId')
  removeFromCart(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.cartService.removeFromCart(userId, productId);
  }
}
