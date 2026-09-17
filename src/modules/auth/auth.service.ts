import { ConflictException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import {
  generateRawToken,
  hashToken,
  normalizeEmail,
} from './utils/token.util';

const BCRYPT_COST = 12;
const VERIFICATION_TOKEN_TTL_HOURS = 24;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const email = normalizeEmail(dto.email);
    const firstName = dto.firstName.trim();
    const lastName = dto.lastName.trim();

    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'An account with this email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_COST);
    const rawToken = generateRawToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(
      Date.now() + VERIFICATION_TOKEN_TTL_HOURS * 60 * 60 * 1000,
    );

    await this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, {
        firstName,
        lastName,
        email,
        password: passwordHash,
        isVerified: false,
        role: UserRole.STUDENT,
        isActive: true,
      });
      const savedUser = await manager.save(user);

      const verificationToken = manager.create(EmailVerificationToken, {
        userId: savedUser.id,
        tokenHash,
        expiresAt,
        usedAt: null,
      });
      await manager.save(verificationToken);
    });

    try {
      await this.mailService.sendVerificationEmail({
        to: email,
        firstName,
        rawToken,
      });
    } catch {
      this.logger.warn(
        `Account created for ${email}, but verification email failed to send`,
      );
    }

    return {
      message: 'Account created. Check your email to verify your account.',
    };
  }
}
