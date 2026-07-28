import pool from "../config/db.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const brokerId = req.user.id;

  const totalResult = await pool.query(
    "SELECT COUNT(*) FROM customers WHERE broker_id = $1",
    [brokerId]
  );

  const todayResult = await pool.query(
    `SELECT COUNT(*)
     FROM customers
     WHERE broker_id = $1
       AND created_at::date = CURRENT_DATE`,
    [brokerId]
  );

  res.json({
    success: true,
    data: {
      totalCustomers: Number(totalResult.rows[0].count),
      activeBroker: 1,
      newToday: Number(todayResult.rows[0].count),
    },
  });
});