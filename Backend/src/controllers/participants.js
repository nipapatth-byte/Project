const participantsModel = require('../models/participants');

//เส้น get ดึงทั้งหมด
const getAllparticipants = async (req,res,next) => {
    try {
        const rows = await participantsModel.getAll();
        res.json({success: true, data: rows});
    } catch (error) {
        next(error);
    }
};

//เส้น get ดึงเฉพาะไอดีที่กำหนด
const getByIdparticipants = async (req,res,next) => {
    try {
        const rows = await participantsModel.getById(req.params.id);
        if (!rows) {
            return res.status(404).json({
                success: false,
                message: 'ไม่พบข้อมูล'
            });
        }
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

//เส้น delete ไอดีที่กำหนด
const deleteparticipants = async (req,res,next) => {
    try {
        const result = await participantsModel.remove(req.params.id);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "ไม่พบข้อมูล" 
            });
        }
        res.json({
            success: true,
            message: 'ลบข้อมูลสำเร็จ'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {getAllparticipants, getByIdparticipants, deleteparticipants}