export const getProfile = async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
};