
export class UserEntity {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  isEmailConfirmed!: boolean;
  googleId?: string;
}
