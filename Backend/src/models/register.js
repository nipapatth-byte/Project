const db = require("../config/db");

// เช็คว่ากิจกรรมเต็มหรือยัง
const checkEvents = async (events_id) => {
  const [rows] = await db.query(`SELECT e.max_participants, COUNT(p.participant_id) AS registered_count
    FROM events e
    LEFT JOIN participants p ON p.events_id = e.events_id
    WHERE e.events_id = ?
    GROUP BY e.events_id
  `, [events_id]);
  return rows[0];
};
 
// เช็ค email ซ้ำในกิจกรรมเดียวกัน
const checkGmail = async (email, events_id) => {
  const [rows] = await db.query(
    "SELECT participant_id FROM participants WHERE email = ? AND events_id = ?",
    [email, events_id]
  );
  return rows.length > 0;
};
 
// บันทึกการลงทะเบียน
const register = async ({ name, email, events_id }) => {
  const [result] = await db.query(
    `INSERT INTO participants (name, email, events_id) VALUES (?, ?, ?)`,
    [name, email, events_id]
  );
  return result.insertId;
};
 
module.exports = { checkEvents, checkGmail, register };
