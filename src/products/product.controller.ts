import { Controller, Post, Body, UseInterceptors, UploadedFiles, HttpException, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { S3Service } from '../common/services/s3.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Express } from 'express';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Unsupported file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createProduct(
    @Body() body: any,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    try {
      if (!images || images.length === 0) {
        throw new HttpException('No images provided', HttpStatus.BAD_REQUEST);
      }

      const imageUrls = await Promise.all(
        images.map(file => this.s3Service.uploadFile(file, 'products/')),
      );

      const product = await this.productService.create({ ...body }, imageUrls);
      return product;
    } catch (error) {
      console.error('Upload error:', error.message);
      throw new HttpException(
        `Failed to upload product images: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('upload-multiple')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Unsupported file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadMultiple(
    @Body() body: any,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    try {
      if (!images || images.length === 0) {
        throw new HttpException('No images provided', HttpStatus.BAD_REQUEST);
      }

      const imageUrls = await Promise.all(
        images.map(file => this.s3Service.uploadFile(file, 'products/')),
      );

      const product = await this.productService.create({ ...body }, imageUrls);
      return product;
    } catch (error) {
      console.error('Upload-multiple error:', error.message);
      throw new HttpException(
        `Failed to upload multiple product images: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create-without-images')
  async createWithoutImages(@Body() body: any) {
    try {
      const product = await this.productService.create({ ...body }, []);
      return product;
    } catch (error) {
      console.error('Create without images error:', error.message);
      throw new HttpException(
        `Failed to create product: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Unsupported file type'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createProductWithOptionalImages(
    @Body() body: any,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    try {
      let imageUrls: string[] = [];

      if (images && images.length > 0) {
        imageUrls = await Promise.all(
          images.map(file => this.s3Service.uploadFile(file, 'products/')),
        );
      }

      const product = await this.productService.create({ ...body }, imageUrls);
      return product;
    } catch (error) {
      console.error('Create product (optional images) error:', error.message);
      throw new HttpException(
        `Failed to create product: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
