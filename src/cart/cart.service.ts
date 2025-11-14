import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './cart.model';
import { AddToCartDto, UpdateCartDto } from './cart.dto';
import { Product, ProductDocument } from '../products/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) {}

  async addToCart(userId: string, dto: AddToCartDto) {
    const product = await this.productModel.findById(dto.productId);
    if (!product) throw new BadRequestException('Product not found');

    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new this.cartModel({
        user: userId,
        products: [{ product: product._id, quantity: dto.quantity, price: product.price }],
        totalPrice: product.price * dto.quantity
      });
      return cart.save();
    }

    const index = cart.products.findIndex(p => p.product.toString() === dto.productId);
    if (index > -1) {
      cart.products[index].quantity += dto.quantity;
    } else {
      cart.products.push({ product: product._id, quantity: dto.quantity, price: product.price });
    }

    cart.totalPrice = cart.products.reduce((sum, p) => sum + p.quantity * p.price, 0);
    return cart.save();
  }

  async removeFromCart(userId: string, productId: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new BadRequestException('Cart not found');

    cart.products = cart.products.filter(p => p.product.toString() !== productId);
    cart.totalPrice = cart.products.reduce((sum, p) => sum + p.quantity * p.price, 0);
    return cart.save();
  }

  async updateQuantity(userId: string, dto: UpdateCartDto) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new BadRequestException('Cart not found');

    const index = cart.products.findIndex(p => p.product.toString() === dto.productId);
    if (index === -1) throw new BadRequestException('Product not in cart');

    if (dto.quantity <= 0) {
      cart.products.splice(index, 1);
    } else {
      cart.products[index].quantity = dto.quantity;
    }

    cart.totalPrice = cart.products.reduce((sum, p) => sum + p.quantity * p.price, 0);
    return cart.save();
  }

  async getCart(userId: string) {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate({
        path: 'products.product',
        select: 'name price images brand category isActive',
        populate: [
          { path: 'brand', select: 'name' },
          { path: 'category', select: 'name' }
        ]
      })
      .exec();

    if (!cart) throw new BadRequestException('Cart not found');
    return cart;
  }
}
