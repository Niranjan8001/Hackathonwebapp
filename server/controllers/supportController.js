import SupportTicket from '../models/SupportTicket.js';
import sendResponse from '../utils/response.js';

export const createSupportTicket = async (req, res, next) => {
  try {
    const { subject, category, message } = req.body;

    if (!subject || !category || !message) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const ticket = new SupportTicket({
      user: req.user.id,
      subject,
      category,
      message
    });

    await ticket.save();

    sendResponse(res, 201, true, 'Support ticket created successfully', ticket);
  } catch (error) {
    console.error('Error in createSupportTicket:', error.message);
    next(error);
  }
};

export const getMySupportTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort({ createdAt: -1 });
    sendResponse(res, 200, true, 'Support tickets fetched successfully', tickets);
  } catch (error) {
    console.error('Error in getMySupportTickets:', error.message);
    next(error);
  }
};
