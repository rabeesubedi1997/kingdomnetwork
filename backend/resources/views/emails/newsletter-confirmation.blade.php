<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="background:#f4f4f4;margin:0;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="background:#09333f;padding:24px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:20px;">{{ config('app.name') }}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 24px;">
            <h2 style="color:#1a202c;margin:0 0 12px;font-size:18px;">Confirm your subscription</h2>
            <p style="color:#4a5568;line-height:1.6;margin:0 0 20px;">
              Thanks for subscribing{{ $subscriber->name ? ', ' . $subscriber->name : '' }}!
              Click the button below to confirm your email address.
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="border-radius:6px;">
                  <a href="{{ $confirmationUrl }}"
                     style="display:inline-block;padding:12px 28px;background:#09333f;color:#ffffff;text-decoration:none;border-radius:6px;font-size:15px;font-weight:600;">
                    Confirm Email
                  </a>
                </td>
              </tr>
            </table>
            <p style="color:#a0aec0;font-size:13px;margin:24px 0 0;">
              If you didn't subscribe, you can ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f7fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#a0aec0;font-size:12px;margin:0;">&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
