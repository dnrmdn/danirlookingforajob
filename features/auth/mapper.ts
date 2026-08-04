import { User } from '@prisma/client';
import { AuthResponse } from './dto';

export class AuthMapper {
  static toResponse(user: User): AuthResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email!, // Assuming email is required for our auth setup
      image: user.image,
    };
  }
}
