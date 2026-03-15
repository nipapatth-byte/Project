//ใช้ claude.ai ช่วยเจน code
// code set การส่ง gmail ให้ผู้ที่ลงทะเบียนเข้าร่วมงานสำเร็จ 
const transporter = require("../config/gmail");

const sendConfirmEmail = async ({ name, email, event_name, events_date, location }) => {
  const dateFormatted = new Date(events_date).toLocaleDateString("th-TH", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  });

  const html = `
  <!DOCTYPE html>
  <html lang="th">
  <head><meta charset="UTF-8"></head>
  <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px">
    <div style="max-width:520px;margin:auto;background:#fff;border-radius:12px;
                padding:32px;border:1px solid #e0e0e0">
      <h2 style="color:#F05A00;margin-top:0">ยืนยันการลงทะเบียน</h2>
      <p>สวัสดีคุณ <strong>${name}</strong></p>
      <p>คุณได้ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จแล้ว</p>

      <div style="background:#F6F3EE;border-radius:8px;padding:16px;margin:20px 0">
        <p style="margin:0 0 8px"><strong>📌 กิจกรรม:</strong> ${event_name}</p>
        <p style="margin:0 0 8px"><strong>📅 วันที่:</strong> ${dateFormatted}</p>
        <p style="margin:0">    <strong>📍 สถานที่:</strong> ${location}</p>
      </div>

      <p style="color:#333"><strong>กรุณานำอีเมลนี้มาแสดงในวันงาน</strong></p>

      <p style="color:#888;font-size:13px">
        หากมีข้อสงสัย กรุณาติดต่อทีมงาน Information Technology Event
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0">
      <p style="color:#bbb;font-size:12px;text-align:center;margin:0">
        Information Technology · Event
      </p>
    </div>
  </body>
  </html>`;

  await transporter.sendMail({
    from:    `"Information Technology Event" <${process.env.SMTP_USER}>`,
    to:      email,
    subject: `📝 ยืนยันการลงทะเบียน — ${event_name}`,
    html,
  });
};

module.exports = { sendConfirmEmail };