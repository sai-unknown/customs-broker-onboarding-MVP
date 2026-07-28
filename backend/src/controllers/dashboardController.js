import prisma from "../config/prisma.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalCustomers = await prisma.customer.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newToday = await prisma.customer.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    res.json({
      success: true,
      data: {
        totalCustomers,
        activeBroker: 1,
        newToday,
      },
    });
  } catch (error) {
    next(error);
  }
};