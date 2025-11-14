import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Model } from 'mongoose';
import { Category } from '../categories/category.schema';
import { Brand } from '../brands/brand.schema';
import { CartDocument } from '../cart/cart.model';
import { WishlistDocument } from '../wishlist/wishlist.model';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: Category.name })
  category: Category;

  @Prop({ type: Types.ObjectId, ref: Brand.name })
  brand: Brand;

  @Prop([String])
  images: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);


ProductSchema.virtual('carts', {
  ref: 'Cart',
  localField: '_id',
  foreignField: 'products.product',
});


ProductSchema.virtual('wishlists', {
  ref: 'Wishlist',
  localField: '_id',
  foreignField: 'products',
});


ProductSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const product = this as ProductDocument;

  
  const CartModel: Model<CartDocument> = this.model('Cart');
  const WishlistModel: Model<WishlistDocument> = this.model('Wishlist');

  
  await CartModel.updateMany(
    { 'products.product': product._id },
    { $pull: { products: { product: product._id } } }
  );

  
  await WishlistModel.updateMany(
    { products: product._id },
    { $pull: { products: product._id } }
  );

  next();
});
