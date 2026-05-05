import Review from '../models/Review.js';

export const getFarmerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ farmer: req.userId })
      .populate('product', 'title images')
      .populate('customer', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, farmer: req.userId },
      { reply, status: 'replied' },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
