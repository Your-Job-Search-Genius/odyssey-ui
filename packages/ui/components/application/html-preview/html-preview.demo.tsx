"use client";

import { HtmlPreview } from "@/components/application/html-preview/html-preview";

const email = `<!doctype html>
<html>
  <body style="margin:0;font-family:Arial,sans-serif;background:#f4f4f5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:24px;">
        <table role="presentation" width="560" style="background:#ffffff;border-radius:8px;">
          <tr><td style="padding:32px;">
            <h1 style="margin:0 0 12px;font-size:22px;color:#111827;">Welcome aboard, Olivia</h1>
            <p style="margin:0 0 16px;color:#4b5563;line-height:1.5;">Your account is ready. Here is what to do next.</p>
            <a href="https://example.com" style="display:inline-block;padding:10px 16px;background:#563bdb;color:#ffffff;border-radius:6px;text-decoration:none;">Open dashboard</a>
            <script>document.body.innerHTML = "scripts never run in the preview";</script>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

export const DefaultDemo = () => <HtmlPreview title="Preview of Welcome email (English)" html={email} height="sm" className="w-full max-w-2xl" />;

export const AutoHeightDemo = () => <HtmlPreview title="Preview of Welcome email, sized to content" html={email} autoHeight className="w-full max-w-2xl" />;
