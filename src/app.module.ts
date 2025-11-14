import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { loggerFunctionalMiddleware } from './common/middleware/logger-functional.middleware';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BrandModule } from './brands/brand.module';
import { CategoryModule } from './categories/category.module';
import { ProductModule } from './products/product.module';
import { CartModule } from './cart/cart.module';         
import { WishlistModule } from './wishlist/wishlist.module'; 
import { CouponModule } from './coupon/coupon.module';     

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    AuthModule,
    UserModule,
    BrandModule,
    CategoryModule,
    ProductModule,
    CartModule,      
    WishlistModule,  
    CouponModule,   
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(loggerFunctionalMiddleware).forRoutes('*');
  }
}
