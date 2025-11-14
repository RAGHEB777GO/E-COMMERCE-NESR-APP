export class CreateCouponDto {
  code: string;
  discount: number;
  expiresAt: Date;
}

export class ApplyCouponDto {
  code: string;
  userId: string;
}
