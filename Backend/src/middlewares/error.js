const errors = (error,req,res,next) => {
    console.error("Error:",error.message);

    // errorจากMySQL 
  if (error.code === "ER_DUP_ENTRY") {
    return res.status(400).json({ success: false, message: "ข้อมูลซ้ำในระบบ" });
  }
 
  //error จาก MySQL Foreign Key เมื่อเพิ่มผู้สมัครแล้ว events_id ที่ใส่ไปไม่มีอยู่จริงในตาราง events
  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ success: false, message: "ไม่พบกิจกรรม" });
  }
 
  const status = error.status || 500;
  res.status(status).json({
    success: false,
    message: error.message || "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
  });
};
 
module.exports = errors;
 