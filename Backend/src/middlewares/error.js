//
const errors = (error,req,res,next) => {
    console.error("Error:",error.message);

    // MySQL duplicate entry
  if (error.code === "ER_DUP_ENTRY") {
    return res.status(400).json({ success: false, message: "ข้อมูลซ้ำในระบบ" });
  }
 
  // MySQL foreign key constraint
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
 