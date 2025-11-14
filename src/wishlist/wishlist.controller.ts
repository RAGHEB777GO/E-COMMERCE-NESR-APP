import { Controller, Post, Delete, Get, Body, Param } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './wishlist.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('add')
  addToWishlist(@Body() body: AddToWishlistDto & { userId: string }) {
    return this.wishlistService.addToWishlist(body.userId, body);
  }

  @Delete('remove/:userId/:productId')
  removeFromWishlist(@Param('userId') userId: string, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(userId, productId);
  }

  @Get(':userId')
  getWishlist(@Param('userId') userId: string) {
    return this.wishlistService.getWishlist(userId);
  }
}
