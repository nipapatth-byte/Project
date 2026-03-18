// Middleware เช็ค token ก่อนเข้า route ที่ต้องการสิทธิ์ admin
const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({
        success: false,
        message: 'กรุณา login ก่อน'
    });
  }

  // ตรวจ token ว่า decode ได้และมี ADMIN_USER อยู่
  try {
    const decode = Buffer.from(token,'base64');
    if (!decode.startsWith(process.env.ADMIN_USER + ':')) {
        throw new Error('invalid');
    }
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token ไม่ถูกต้อง กรุณา login ใหม่' });
  }
};

module.exports = auth;
