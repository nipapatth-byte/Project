require('dotenv').config();

//Admin login — เช็คจาก .env ไม่ต้องมีตาราง DB
//ตั้งค่าใน .env: ADMIN_USER=admin  ADMIN_PASS=1234

const login = (req,res) => {
    const {username,password} = req.body;

    if (!username || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'กรุณากรอก username และ password '
        });
    }

    if (username != process.env.ADMIN_USER || password != process.env.ADMIN_PASS) {
        return res.status(400).json({
            success: false,
            message: 'username หรือ password ไม่ถูกต้อง'
        });
    }
        
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        res.json({
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ',
            token
        });
};

module.exports = { login };