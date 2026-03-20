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
  return rows;
};

// ลบผู้เข้าร่วม
const remove = async (id) => {
  const [result] = await db.query(
    "DELETE FROM participants WHERE participant_id = ?", [id]
  );
  return result;
};

module.exports = { getAll, remove };