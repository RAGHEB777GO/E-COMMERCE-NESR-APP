import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './wishlist.model';
import { Product } from '../products/product.schema';
import { AddToWishlistDto } from './wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
    @InjectModel(Product.name) private productModel: Model<Product>
  ) {}

  async addToWishlist(userId: string, dto: AddToWishlistDto) {
    const product = await this.productModel.findById(dto.productId);
    if (!product) throw new BadRequestException('Product not found');

    let wishlist = await this.wishlistModel.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new this.wishlistModel({ user: userId, products: [product._id] });
      return wishlist.save();
    }

    if (!wishlist.products.includes(product._id)) {
      wishlist.products.push(product._id);
    }

    return wishlist.save();
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await this.wishlistModel.findOne({ user: userId });
    if (!wishlist) throw new BadRequestException('Wishlist not found');

    wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
    return wishlist.save();
  }

  async getWishlist(userId: string) {
    return this.wishlistModel.findOne({ user: userId }).populate('products');
  }
}
