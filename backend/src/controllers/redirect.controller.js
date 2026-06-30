const urlService = require('../services/url.service');
const analyticsService = require('../services/analytics.service');
const { asyncHandler } = require('../middlewares/errorHandler');
const { addToQueue } = require('../jobs/queue');

const redirect = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const url = await urlService.resolveUrl(code);

  if (!url) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"><title>Link Not Found – ShortLink Pro</title>
      <style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#F8FAFC;color:#1e293b}
      .box{text-align:center}.h1{font-size:4rem;font-weight:800;color:#6366F1;margin:0}.p{color:#64748B;margin:12px 0 24px}
      a{background:#6366F1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600}</style></head>
      <body><div class="box"><div class="h1">404</div><p class="p">This short link doesn't exist or has been removed.</p>
      <a href="${process.env.CLIENT_URL || '/'}">Go Home</a></div></body></html>
    `);
  }

  // Check if expired
  if (url.expiresAt && new Date() > new Date(url.expiresAt)) {
    return res.status(410).send(`
      <!DOCTYPE html><html><head><title>Link Expired</title>
      <style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#F8FAFC}
      .box{text-align:center;padding:40px}.icon{font-size:4rem}.h2{color:#1e293b;margin:16px 0 8px}.p{color:#64748B;margin-bottom:24px}
      a{background:#6366F1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none}</style></head>
      <body><div class="box"><div class="icon">⏰</div><h2 class="h2">This link has expired</h2>
      <p class="p">The short link you visited is no longer active.</p>
      <a href="${process.env.CLIENT_URL || '/'}">Go Home</a></div></body></html>
    `);
  }

  // Check if disabled
  if (!url.isActive) {
    return res.status(403).send(`
      <!DOCTYPE html><html><head><title>Link Disabled</title>
      <style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#F8FAFC}
      .box{text-align:center;padding:40px}a{background:#6366F1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none}</style></head>
      <body><div class="box"><div style="font-size:4rem">🔒</div><h2>Link Disabled</h2>
      <p style="color:#64748B;margin-bottom:24px">This link has been disabled by its owner.</p>
      <a href="${process.env.CLIENT_URL || '/'}">Go Home</a></div></body></html>
    `);
  }

  // Handle password-protected URLs
  if (url.isPasswordProtected) {
    const providedPassword = req.query.p || req.headers['x-url-password'];

    if (!providedPassword) {
      return res.send(`
        <!DOCTYPE html><html><head><title>Password Required</title>
        <style>*{box-sizing:border-box}body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#F8FAFC;margin:0}
        .box{background:#fff;padding:40px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);width:100%;max-width:400px;text-align:center}
        h2{color:#1e293b;margin:0 0 8px}p{color:#64748B;margin:0 0 24px;font-size:14px}
        input{width:100%;padding:12px;border:1.5px solid #E2E8F0;border-radius:8px;font-size:15px;outline:none;margin-bottom:12px}
        input:focus{border-color:#6366F1}
        button{width:100%;background:#6366F1;color:#fff;border:none;padding:12px;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer}
        .icon{font-size:3rem;margin-bottom:16px}</style></head>
        <body><div class="box"><div class="icon">🔐</div>
        <h2>Password Required</h2>
        <p>This link is password protected. Enter the password to continue.</p>
        <form method="GET" action="/${code}">
          <input type="password" name="p" placeholder="Enter password" autofocus required />
          <button type="submit">Access Link</button>
        </form></div></body></html>
      `);
    }

    const Url = require('../models/Url');
    const urlWithPass = await Url.findOne({ shortCode: code }).select('+password');
    const isMatch = await urlWithPass.comparePassword(providedPassword);

    if (!isMatch) {
      return res.status(401).send(`
        <!DOCTYPE html><html><head><title>Wrong Password</title>
        <style>*{box-sizing:border-box}body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#F8FAFC;margin:0}
        .box{background:#fff;padding:40px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08);width:100%;max-width:400px;text-align:center}
        .err{color:#EF4444;font-size:13px;margin-bottom:16px}
        input{width:100%;padding:12px;border:1.5px solid #EF4444;border-radius:8px;font-size:15px;outline:none;margin-bottom:12px}
        button{width:100%;background:#6366F1;color:#fff;border:none;padding:12px;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer}</style></head>
        <body><div class="box"><div style="font-size:3rem;margin-bottom:16px">🔐</div>
        <h2 style="color:#1e293b;margin:0 0 8px">Incorrect Password</h2>
        <p style="color:#64748B;margin:0 0 16px;font-size:14px">The password you entered is incorrect.</p>
        <form method="GET" action="/${code}">
          <div class="err">⚠ Incorrect password, please try again.</div>
          <input type="password" name="p" placeholder="Enter password" autofocus required />
          <button type="submit">Try Again</button>
        </form></div></body></html>
      `);
    }
  }

  // Queue analytics processing asynchronously
  setImmediate(async () => {
    try {
      await analyticsService.track({ urlId: url._id, userId: url.user, req });
    } catch (err) {
      // Non-critical: log but don't fail the redirect
      require('../config/logger').error('Analytics tracking error:', err.message);
    }
  });

  // Fast redirect
  return res.redirect(301, url.originalUrl);
});

module.exports = { redirect };
