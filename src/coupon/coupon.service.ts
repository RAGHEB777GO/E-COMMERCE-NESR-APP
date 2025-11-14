import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './coupon.model';
import { CreateCouponDto } from './coupon.dto'; 

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {}

  async createCoupon(dto: CreateCouponDto) {
    const existing = await this.couponModel.findOne({ code: dto.code });
    if (existing) throw new BadRequestException('Coupon code already exists');

    const coupon = new this.couponModel(dto);
    return coupon.save();
  }

  async applyCoupon(code: string) {
    const coupon = await this.couponModel.findOne({ code, isActive: true });
    if (!coupon) throw new BadRequestException('Invalid or expired coupon');
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      coupon.isActive = false;
      await coupon.save();
      throw new BadRequestException('Coupon expired');
    }
    return coupon;
  }

  async deactivateCoupon(id: string) {
    const coupon = await this.couponModel.findById(id);
    if (!coupon) throw new BadRequestException('Coupon not found');
    coupon.isActive = false;
    return coupon.save();
  }
}
