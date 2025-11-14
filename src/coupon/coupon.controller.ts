import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto, ApplyCouponDto } from './coupon.dto';

@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('create')
  createCoupon(@Body() body: CreateCouponDto) {
    return this.couponService.createCoupon(body);
  }

  @Post('apply')
  applyCoupon(@Body() body: ApplyCouponDto) {
    return this.couponService.applyCoupon(body.code);
  }

  @Patch('deactivate/:id')
  deactivateCoupon(@Param('id') id: string) {
    return this.couponService.deactivateCoupon(id);
  }
}
