const eventsModel = require("../models/events");

// เส้น get ของ events
const getAllEvents = async (req,res,next) => {
    try {
        const events = await eventsModel.getAll();
        res.json({success: true, data: events});
    } catch (error) {
        next(error);
    }
};

// เส้น get ของ events แบบกำหนด id
const getByIdEvents = async (req,res,next) => {
    try {
        const events = await eventsModel.getById(req.params.id);
        res.json({success: true, data: events});
    } catch (error) {
        next(error);
    }
};

//เส้น post
const createEvent = async (req, res, next) => {
  try {
    const { event_name, location, events_date, max_participants } = req.body;
    const id = await eventsModel.create({ event_name, location, events_date, max_participants });
    res.status(201).json({ success: true, message: "สร้างกิจกรรมสำเร็จ", data: { events_id: id } });
  } catch (err) {
    next(err);
  }
};
 
// เส้น put
const updateEvent = async (req, res, next) => {
  try {
    const { event_name, location, events_date, max_participants } = req.body;
    const affected = await eventsModel.update(req.params.id, { event_name, location, events_date, max_participants });
    if (!affected) {
      return res.status(404).json({ success: false, message: "ไม่พบกิจกรรม" });
    }
    res.json({ success: true, message: "แก้ไขกิจกรรมสำเร็จ" });
  } catch (err) {
    next(err);
  }
};
 
// เส้น delete
const deleteEvent = async (req, res, next) => {
  try {
    const affected = await eventsModel.remove(req.params.id);
    if (!affected) {
      return res.status(404).json({ success: false, message: "ไม่พบกิจกรรม" });
    }
    res.json({ success: true, message: "ลบกิจกรรมสำเร็จ" });
  } catch (err) {
    next(err);
  }
};
 
module.exports = { getAllEvents, getByIdEvents, createEvent, updateEvent, deleteEvent };