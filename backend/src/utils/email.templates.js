const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ShortLink Pro</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F8FAFC; color: #1E293B; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #6366F1, #4F46E5); padding: 40px; text-align: center; }
    .header h1 { color: white; font-size: 24px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.8); margin-top: 4px; }
    .body { padding: 40px; }
    .body h2 { font-size: 20px; font-weight: 600; margin-bottom: 12px; }
    .body p { color: #64748B; line-height: 1.6; margin-bottom: 16px; }
    .btn { display: inline-block; background: #6366F1; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin: 16px 0; }
    .divider { height: 1px; background: #E2E8F0; margin: 24px 0; }
    .footer { padding: 24px 40px; background: #F8FAFC; text-align: center; }
    .footer p { color: #94A3B8; font-size: 13px; }
    .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px 16px; border-radius: 4px; font-size: 13px; color: #92400E; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ ShortLink Pro</h1>
      <p>Smart URL Shortener & Analytics</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ShortLink Pro. All rights reserved.</p>
      <p style="margin-top: 4px;">You received this email because you have an account with ShortLink Pro.</p>
    </div>
  </div>
</body>
</html>
`;

const emailVerificationTemplate = ({ name, verifyUrl }) => baseTemplate(`
  <h2>Verify your email address</h2>
  <p>Hi ${name},</p>
  <p>Thanks for signing up for ShortLink Pro! Please verify your email address to activate your account and start shortening URLs.</p>
  <div style="text-align: center;">
    <a href="${verifyUrl}" class="btn">Verify Email Address</a>
  </div>
  <div class="divider"></div>
  <p style="font-size: 13px;">Or copy this link: <a href="${verifyUrl}" style="color: #6366F1;">${verifyUrl}</a></p>
  <div class="warning">This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.</div>
`);

const passwordResetTemplate = ({ name, resetUrl }) => baseTemplate(`
  <h2>Reset your password</h2>
  <p>Hi ${name},</p>
  <p>We received a request to reset your ShortLink Pro password. Click the button below to create a new password.</p>
  <div style="text-align: center;">
    <a href="${resetUrl}" class="btn">Reset Password</a>
  </div>
  <div class="divider"></div>
  <p style="font-size: 13px;">Or copy this link: <a href="${resetUrl}" style="color: #6366F1;">${resetUrl}</a></p>
  <div class="warning">This link expires in 1 hour. If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</div>
`);

const welcomeTemplate = ({ name }) => baseTemplate(`
  <h2>Welcome to ShortLink Pro! 🎉</h2>
  <p>Hi ${name},</p>
  <p>Your email has been verified and your account is now active. You're ready to start creating powerful short links with detailed analytics.</p>
  <p><strong>What you can do:</strong></p>
  <ul style="color: #64748B; line-height: 2; padding-left: 20px; margin-bottom: 16px;">
    <li>Shorten any URL in seconds</li>
    <li>Set custom aliases for branded links</li>
    <li>Track clicks, browsers, devices, and countries</li>
    <li>Generate QR codes for your links</li>
    <li>Set expiration dates and password protection</li>
  </ul>
  <div style="text-align: center;">
    <a href="${process.env.CLIENT_URL}/dashboard" class="btn">Go to Dashboard</a>
  </div>
`);

module.exports = { emailVerificationTemplate, passwordResetTemplate, welcomeTemplate };
