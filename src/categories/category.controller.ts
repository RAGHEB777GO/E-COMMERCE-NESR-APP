import { Controller, Get, Post, Put, Delete,Patch, Param, Body, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/categories',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
  }))
  async create(@Body('name') name: string, @UploadedFile() file: Express.Multer.File) {
    try {
      const image = file ? file.filename : undefined;
      const category = await this.categoryService.create(name, image);
      return category;
    } catch (error) {
      throw new HttpException(`Failed to create category: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      const categories = await this.categoryService.findAll();
      return { categories, total: categories.length };
    } catch (error) {
      throw new HttpException(`Failed to fetch categories: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const category = await this.categoryService.findOne(id);
      return category;
    } catch (error) {
      throw new HttpException(`Category not found: ${error.message}`, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/categories',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
  }))
  async update(@Param('id') id: string, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    try {
      const updateData: any = { ...body };
      if (file) updateData.image = file.filename;
      const updatedCategory = await this.categoryService.update(id, updateData);
      return updatedCategory;
    } catch (error) {
      throw new HttpException(`Failed to update category: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('soft/:id')
  async softDelete(@Param('id') id: string) {
    try {
      const category = await this.categoryService.softDelete(id);
      return category;
    } catch (error) {
      throw new HttpException(`Failed to soft delete category: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('hard/:id')
  async hardDelete(@Param('id') id: string) {
    try {
      await this.categoryService.hardDelete(id);
      return { message: 'Category permanently deleted' };
    } catch (error) {
      throw new HttpException(`Failed to delete category: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':id/brands/:brandId')
  async addBrand(@Param('id') id: string, @Param('brandId') brandId: string) {
    try {
      const category = await this.categoryService.addBrand(id, brandId);
      return category;
    } catch (error) {
      throw new HttpException(`Failed to add brand: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id/brands/:brandId')
  async removeBrand(@Param('id') id: string, @Param('brandId') brandId: string) {
    try {
      const category = await this.categoryService.removeBrand(id, brandId);
      return category;
    } catch (error) {
      throw new HttpException(`Failed to remove brand: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
