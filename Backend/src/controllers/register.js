const registerModel = require("../models/register");
const eventsModel = require("../models/events");
const gmail = require("../models/gmail");

//ตรวจสอบว่าผู้ใช้กรอกการลงทะเบียนครบไหม
const validateRegis = (data) => {
  const errors = [];
  if (!data.name) errors.push("กรุณากรอกชื่อ-นามสกุล");
  if (!data.email) errors.push("กรุณากรอกอีเมล");
  if (!data.events_id) errors.push("กรุณาเลือกกิจกรรม");

  //เช็ค รูปแบบ gmail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push("รูปแบบอีเมลไม่ถูกต้อง");
  }
  return errors;
};

//สร้างเส้น post เช็ค บันทึก ส่ง gmail
const registerEvent = async (req, res, next) => {
  try {
    const { name, email, events_id } = req.body;

    const event = await eventsModel.getById(events_id);
    if (!event) {
      return res.status(404).json({ success: false, message: "ไม่พบกิจกรรม" });
    }

    const capacity = await registerModel.checkEvents(events_id);
    if (capacity.registered_count >= capacity.max_participants) {
      return res.status(400).json({ success: false, message: 'กิจกรรมนี้เต็มแล้ว' });
    }

    const gmail = await registerModel.checkGmail(email, events_id);
    if (gmail) return res.status(400).json({ success: false, message: "อีเมลนี้ลงทะเบียนไปแล้ว" });

    await registerModel.register({ name, email, events_id });


   try {
      await gmail.sendConfirmEmail({
        name,
        email,
        event_name:  event.event_name,
        events_date: event.events_date,
        location:    event.location,
      });
    } catch (emailError) {
      console.error("⚠️ ส่งอีเมลไม่สำเร็จ:", emailError.message);
      // ไม่ return error — การลงทะเบียนสำเร็จแล้ว แค่อีเมลมีปัญหา
    }

    res.status(201).json({
        success: true,
        message: "ลงทะเบียนสำเร็จ! ตรวจสอบอีเมลของคุณ" });

  } catch (error) {
    next(error);
  }
};

module.exports = {registerEvent}