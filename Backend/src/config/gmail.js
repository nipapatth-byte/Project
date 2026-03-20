// set ใช้ claude.ai
const nodemailer = require("nodemailer");
require("dotenv").config();
 
//ตัวส่งจดหมาย 
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || "smtp.gmail.com",
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false, // true สำหรับ port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
 
// ทดสอบการเชื่อมต่อ SMTP
transporter.verify((err) => {
  if (err) console.error("❌ Email service failed to connect:", err.message);
  else     console.log("✅ Email service connected");
});

module.exports = transporter;
 