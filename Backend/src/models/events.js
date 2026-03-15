//เรียกใช้ /db ในนั้นจะมีการ connec กับ mysql
const db = require("../config/db")

// ดึงกิจกรรมทั้งหมดและนับจำนวนผู้ลงทะเบียน
const getAll = async () => {
    const [rows] = await db.query(
    `SELECT e.*, COUNT(p.participant_id) AS registered_count
    FROM events e
    LEFT JOIN participants p ON p.events_id = e.events_id
    GROUP BY e.events_id
    ORDER BY e.events_date ASC`);
    return rows;
};

//ดึงกิจกรรมเดียวตาม id ที่กำหนด
const getById = async (id) => {
    const [rows] = await db.query(`
    SELECT e.*, COUNT(p.participant_id) AS registered_count
    FROM events e
    LEFT JOIN participants p ON p.events_id = e.events_id
    WHERE e.events_id = ?
    GROUP BY e.events_id
  `, [id]);
  return rows[0]; //SQL จะคืนค่าเป็น Array จึงมี [0] เพือบอกว่าเอาแค่ตัวแรก
};

//สร้างกิจกรรมใหม่
const create = async (data) => {
  const {event_name,location,events_date,max_participants} = data;
  const [result] = await db.query('INSERT INTO events (event_name, location, events_date, max_participants) VALUES (?,?,?,?)',
  [event_name,location,events_date,max_participants]
  );
  return result; //*เผื่อ error
};


//แก้ไขกิจกรรม
const update = async (id,data) => {
  const {event_name, location, events_date, max_participants} = data;
  const [result] = await db.query('UPDATE events SET event_name = ?, location = ?,events_date = ?, max_participants = ? WHERE events_id =?'
    ,[event_name, location, events_date, max_participants, id]
    );
    return result;
};

//ลบกิจกรรม
const remove =async (id) => {
  const [result] = await db.query('DELETE FROM events WHERE events_id = ?',[id]);
  return result;
};

module.exports = {getAll,getById, create, update, remove};