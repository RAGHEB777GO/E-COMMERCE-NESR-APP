import { Controller, Get, Post, Put, Delete, Patch, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BrandService } from './brand.service';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/brands',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
  }))
  create(@Body('name') name: string, @UploadedFile() file: Express.Multer.File) {
    const image = file ? file.filename : undefined;
    return this.brandService.create(name, image);
  }

  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/brands',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
  }))
  update(@Param('id') id: string, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
    const updateData: any = { ...body };
    if (file) updateData.image = file.filename;
    return this.brandService.update(id, updateData);
  }

  @Patch(':id/freeze')
  freeze(@Param('id') id: string) {
    return this.brandService.updateStatus(id, false);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.brandService.updateStatus(id, true);
  }

  @Delete('soft/:id')
  softDelete(@Param('id') id: string) {
    return this.brandService.softDelete(id);
  }

  @Delete('hard/:id')
  hardDelete(@Param('id') id: string) {
    return this.brandService.hardDelete(id);
  }
}
