import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from './brand.schema';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<BrandDocument>) {}

  async create(name: string, image?: string): Promise<Brand> {
    const brand = new this.brandModel({ name, image });
    return brand.save();
  }

  async findAll(): Promise<Brand[]> {
    return this.brandModel.find({}).exec();
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(id: string, updateData: Partial<Brand>): Promise<Brand> {
    const brand = await this.brandModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async softDelete(id: string): Promise<Brand> {
    const brand = await this.brandModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async hardDelete(id: string): Promise<{ message: string }> {
    const result = await this.brandModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Brand not found');
    return { message: 'Brand permanently deleted' };
  }

  
  async updateStatus(id: string, isActive: boolean): Promise<Brand> {
    const brand = await this.brandModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true },
    ).exec();

    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }
}
