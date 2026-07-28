import pool from "../config/db.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    // Total customers
    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM customers"
    );

    // Customers created today
    const todayResult = await pool.query(`
      SELECT COUNT(*)
      FROM customers
      WHERE created_at::date = CURRENT_DATE
    `);

    res.json({
      success: true,
      data: {
        totalCustomers: Number(totalResult.rows[0].count),
        activeBroker: 1,
        newToday: Number(todayResult.rows[0].count),
      },
    });
  } catch (error) {
    next(error);
  }
};