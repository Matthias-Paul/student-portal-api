import { siteConfig } from '../site.config';
import {
  emailBrand as brand,
  emailShell,
  escapeHtml,
} from './shared';

export type VerifyEmailData = {
  firstName: string;
  verifyUrl: string;
};

export function buildVerifyEmail(data: VerifyEmailData) {
  const firstName = data.firstName.trim() || 'there';
  const subject = `Verify your ${siteConfig.name} account`;

  const html = emailShell({
    preview: `Hi ${firstName} — confirm your email to finish setting up your account.`,
    bodyHtml: `
      <p style="margin:0 0 16px;">Hi ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 16px;color:${brand.muted};">
        Thanks for joining <strong style="color:${brand.text};font-weight:600;">${escapeHtml(siteConfig.name)}</strong>.
        Confirm your email address to activate your student portal account.
      </p>
      <p style="margin:0 0 24px;">
        <a href="${escapeHtml(data.verifyUrl)}"
           style="display:inline-block;padding:12px 20px;background:${brand.green};color:${brand.white};text-decoration:none;font-weight:600;font-size:14px;">
          Verify email
        </a>
      </p>
      <p style="margin:0 0 8px;color:${brand.muted};font-size:14px;">
        Or copy and paste this link into your browser:
      </p>
      <p style="margin:0 0 20px;padding:12px 14px;background:${brand.page};color:${brand.text};font-size:13px;word-break:break-all;">
        ${escapeHtml(data.verifyUrl)}
      </p>
      <p style="margin:0 0 16px;color:${brand.muted};font-size:14px;">
        This link expires in 24 hours. If you did not create an account, you can safely ignore this email.
      </p>
      <p style="margin:0;">
        Best,<br />
        <span style="color:${brand.text};">${escapeHtml(siteConfig.name)}</span>
      </p>
    `,
  });

  const text = [
    `Hi ${firstName},`,
    '',
    `Thanks for joining ${siteConfig.name}. Confirm your email address to activate your student portal account.`,
    '',
    `Verify your email: ${data.verifyUrl}`,
    '',
    'This link expires in 24 hours. If you did not create an account, you can safely ignore this email.',
    '',
    'Best,',
    siteConfig.name,
  ].join('\n');

  return { subject, html, text };
}
