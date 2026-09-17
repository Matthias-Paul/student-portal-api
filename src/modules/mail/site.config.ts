export const siteConfig = {
  name: 'Treesoft Academy',
  get url() {
    return process.env.FRONTEND_URL ?? 'http://localhost:3000';
  },
  contactEmail: 'noreply@treesoftacademy.com',
  phone: '+2340000000000',
  phoneDisplay: '+234 000 000 0000',
  location: 'Lagos',
} as const;
