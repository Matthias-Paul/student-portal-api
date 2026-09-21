import { siteConfig } from '../site.config';

export const emailBrand = {
  green: '#00AE45',
  dark: '#005612',
  mid: '#009134',
  text: '#222222',
  muted: '#555555',
  line: '#dddddd',
  white: '#ffffff',
  page: '#f4f4f4',
} as const;

export function emailLogoUrl() {
  return 'https://res.cloudinary.com/drkxtuaeg/image/upload/v1788011194/uyxz4kldtvrxilu9t0lc.jpg';
}

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function simpleRow(label: string, value: string) {
  const { muted, text } = emailBrand;
  return `
    <tr>
      <td style="padding:4px 0;color:${muted};font-size:14px;width:110px;vertical-align:top;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:4px 0;color:${text};font-size:14px;vertical-align:top;">
        ${escapeHtml(value)}
      </td>
    </tr>
  `;
}

export function simpleLinkRow(label: string, href: string, linkText = 'Open') {
  const { muted, mid } = emailBrand;
  return `
    <tr>
      <td style="padding:4px 0;color:${muted};font-size:14px;width:110px;vertical-align:top;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:4px 0;font-size:14px;vertical-align:top;">
        <a href="${escapeHtml(href)}" style="color:${mid};">${escapeHtml(linkText)}</a>
      </td>
    </tr>
  `;
}

export function emailShell(options: { preview: string; bodyHtml: string }) {
  const { preview, bodyHtml } = options;
  const brand = emailBrand;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <style>
    :root { color-scheme: light only; }
    .email-header,
    .email-header td {
      background-color: #0d0d0d !important;
      background: #0d0d0d !important;
    }
    .email-header-title {
      color: #ffffff !important;
    }
    @media (prefers-color-scheme: dark) {
      .email-header,
      .email-header td {
        background-color: #0d0d0d !important;
        background: #0d0d0d !important;
      }
      .email-header-title {
        color: #ffffff !important;
      }
      u + .body .email-header,
      u + .body .email-header td {
        background-color: #0d0d0d !important;
        background: #0d0d0d !important;
      }
    }
  </style>
</head>
<body class="body" style="margin:0;padding:0;background:${brand.page};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${escapeHtml(preview)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${brand.page};">
    <tr>
      <td style="padding:28px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:${brand.white};">
          <tr>
            <td
              class="email-header"
              bgcolor="#0d0d0d"
              style="padding:18px 28px;background-color:#0d0d0d;background:#0d0d0d;"
            >
              <table role="presentation" cellpadding="0" cellspacing="0" bgcolor="#0d0d0d" style="background-color:#0d0d0d;background:#0d0d0d;">
                <tr>
                  <td
                    class="email-header"
                    bgcolor="#0d0d0d"
                    style="vertical-align:middle;padding-right:12px;background-color:#0d0d0d;background:#0d0d0d;"
                  >
                    <img
                      src="${emailLogoUrl()}"
                      alt=""
                      width="28"
                      style="display:block;border:0;outline:none;width:28px;height:auto;background-color:#0d0d0d;"
                    />
                  </td>
                  <td
                    class="email-header-title"
                    bgcolor="#0d0d0d"
                    style="vertical-align:middle;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#ffffff;background-color:#0d0d0d;"
                  >
                    ${escapeHtml(siteConfig.name)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${brand.text};">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${brand.muted};border-top:1px solid ${brand.line};">
              <p style="margin:18px 0 0;">
                ${escapeHtml(siteConfig.name)} · ${escapeHtml(siteConfig.location)}<br />
                <a href="mailto:${escapeHtml(siteConfig.contactEmail)}" style="color:${brand.mid};text-decoration:none;">${escapeHtml(siteConfig.contactEmail)}</a>
                &nbsp;·&nbsp;
                <a href="tel:${escapeHtml(siteConfig.phone)}" style="color:${brand.mid};text-decoration:none;">${escapeHtml(siteConfig.phoneDisplay)}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
