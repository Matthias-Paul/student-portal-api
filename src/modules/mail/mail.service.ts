import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { buildVerifyEmail } from './templates/verify-email.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('smtp.host'),
      port: this.configService.getOrThrow<number>('smtp.port'),
      secure: this.configService.get<boolean>('smtp.secure') ?? false,
      auth: {
        user: this.configService.getOrThrow<string>('smtp.user'),
        pass: this.configService.getOrThrow<string>('smtp.pass'),
      },
    });
  }

  async sendMail(options: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<void> {
    const from = this.configService.getOrThrow<string>('smtp.from');

    await this.transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  }

  async sendVerificationEmail(options: {
    to: string;
    firstName: string;
    rawToken: string;
  }): Promise<void> {
    const frontendUrl = this.configService.getOrThrow<string>('app.frontendUrl');
    const verifyUrl = `${frontendUrl}/verify-email?token=${options.rawToken}`;
    const { subject, html, text } = buildVerifyEmail({
      firstName: options.firstName,
      verifyUrl,
    });

    try {
      await this.sendMail({
        to: options.to,
        subject,
        html,
        text,
      });
      this.logger.log(`Verification email sent to ${options.to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${options.to}`,
        error instanceof Error ? error.stack : undefined,
      );
      // Still log the link in development so local testing is not blocked
      if (this.configService.get<string>('app.nodeEnv') !== 'production') {
        this.logger.warn(`Dev fallback verification link: ${verifyUrl}`);
      }
      throw error;
    }
  }
}
