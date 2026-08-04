import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { RegisterRequest, LoginRequest } from './validation';
import { AuthMapper } from './mapper';
import { ConflictError, UnauthorizedError } from '@/lib/shared/errors';
import { DomainEventBus } from '../activity/listener';

export class AuthCommandService {
  async register(data: RegisterRequest) {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // 3. Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    // 4. Dispatch domain event for activity logging
    DomainEventBus.emit('user.registered', { userId: user.id });

    // 5. Return mapped response (hides password)
    return AuthMapper.toResponse(user);
  }

  async verifyCredentials(data: LoginRequest) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await bcrypt.compare(data.password, user.password);

    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Dispatch event
    DomainEventBus.emit('user.logged_in', { userId: user.id });

    return AuthMapper.toResponse(user);
  }
}
