import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { BrandDocument } from '../brands/brand.schema';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async create(name: string, image?: string): Promise<Category> {
    const category = new this.categoryModel({ name, image });
    return category.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find({}).populate('brands').exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).populate('brands').exec();
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, updateData: Partial<Category>): Promise<Category> {
    const category = await this.categoryModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async softDelete(id: string): Promise<Category> {
    const category = await this.categoryModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async hardDelete(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Category not found');
  }

  async addBrand(categoryId: string, brandId: string): Promise<Category> {
    const category = await this.categoryModel.findById(categoryId).exec();
    if (!category) throw new NotFoundException('Category not found');
    if (!category.brands.includes(new Types.ObjectId(brandId))) {
      category.brands.push(new Types.ObjectId(brandId));
      await category.save();
    }
    return category;
  }

  async removeBrand(categoryId: string, brandId: string): Promise<Category> {
    const category = await this.categoryModel.findById(categoryId).exec();
    if (!category) throw new NotFoundException('Category not found');
    category.brands = category.brands.filter(b => b.toString() !== brandId);
    await category.save();
    return category;
  }
}
