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
            <h2 style="color:#1a202c;margin:0 0 12px;font-size:18px;">New Press Access Request</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#4a5568;font-size:14px;border-bottom:1px solid #e2e8f0;"><strong>Name:</strong></td><td style="padding:8px 0;color:#1a202c;font-size:14px;border-bottom:1px solid #e2e8f0;">{{ $name }}</td></tr>
              <tr><td style="padding:8px 0;color:#4a5568;font-size:14px;border-bottom:1px solid #e2e8f0;"><strong>Email:</strong></td><td style="padding:8px 0;color:#1a202c;font-size:14px;border-bottom:1px solid #e2e8f0;">{{ $email }}</td></tr>
              @if($organization)
              <tr><td style="padding:8px 0;color:#4a5568;font-size:14px;border-bottom:1px solid #e2e8f0;"><strong>Organization:</strong></td><td style="padding:8px 0;color:#1a202c;font-size:14px;border-bottom:1px solid #e2e8f0;">{{ $organization }}</td></tr>
              @endif
              <tr><td style="padding:8px 0;color:#4a5568;font-size:14px;border-bottom:1px solid #e2e8f0;"><strong>Reason:</strong></td><td style="padding:8px 0;color:#1a202c;font-size:14px;border-bottom:1px solid #e2e8f0;">{{ $reason }}</td></tr>
            </table>
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
