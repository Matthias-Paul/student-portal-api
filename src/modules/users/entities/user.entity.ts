import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmailVerificationToken } from '../../auth/entities/email-verification-token.entity';
import { PasswordResetToken } from '../../auth/entities/password-reset-token.entity';
import { RefreshToken } from '../../auth/entities/refresh-token.entity';
import { UserRole } from '../enums/user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'first_name', length: 100 })
  firstName!: string;

  @Column({ name: 'last_name', length: 100 })
  lastName!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  /** Never selected by default — opt in with .addSelect('user.password') */
  @Column({ select: false })
  password!: string;

  @Column({ name: 'is_verified', default: false })
  isVerified!: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role!: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens!: RefreshToken[];

  @OneToMany(() => EmailVerificationToken, (token) => token.user)
  emailVerificationTokens!: EmailVerificationToken[];

  @OneToMany(() => PasswordResetToken, (token) => token.user)
  passwordResetTokens!: PasswordResetToken[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
