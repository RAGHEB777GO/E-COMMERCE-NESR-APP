import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(data: any, images: string[] = []): Promise<Product> {
    const product = new this.productModel({ ...data, images });
    return product.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find({}).populate('brand').populate('category').exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('brand').populate('category').exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateData: any, images?: string[]): Promise<Product> {
    if (images && images.length > 0) updateData.images = images;
    const product = await this.productModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async softDelete(id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async hardDelete(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Product not found');
  }
}
