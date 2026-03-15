const db = require("../config/db");

// ดึงผู้เข้าร่วมทั้งหมดและชื่อกิจกรรม
const getAll = async () => {
  const [rows] = await db.query(`
    SELECT
      p.participant_id,
      p.name,
      p.email,
      p.events_id,
      p.created_at,
      e.event_name,
      e.events_date,
      e.location
    FROM participants p
    JOIN events e ON e.events_id = p.events_id
    ORDER BY p.participant_id ASC
  `);
  /** SELECT p.*, e.event_name, e.events_date, e.location
FROM participants p
JOIN events e ON e.events_id = p.events_id
ORDER BY p.participant_id ASC แบบสั้น */
  return rows;
};

// ดึงผู้เข้าร่วมรายคน
const getById = async (id) => {
  const [rows] = await db.query(`
    SELECT
      p.*,
      e.event_name,
      e.events_date,
      e.location
    FROM participants p
    JOIN events e ON e.events_id = p.events_id
    WHERE p.participant_id = ?
  `, [id]);
  return rows[0];
};

// ลบผู้เข้าร่วม
const remove = async (id) => {
  const [result] = await db.query(
    "DELETE FROM participants WHERE participant_id = ?", [id]
  );
  return result;
};

module.exports = { getAll, getById, remove };