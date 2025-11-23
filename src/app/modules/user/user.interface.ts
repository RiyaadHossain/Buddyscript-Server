

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  resetPasswordToken?: string | undefined;
  resetPasswordExpires?: Date | undefined;
}

