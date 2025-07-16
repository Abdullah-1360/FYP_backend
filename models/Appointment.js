const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index to prevent double booking
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 }, { unique: true });

// Add methods to check availability
appointmentSchema.statics.isTimeSlotAvailable = async function(doctorId, appointmentDate) {
  const existingAppointment = await this.findOne({
    doctorId,
    appointmentDate,
    status: { $nin: ['cancelled'] }
  });
  return !existingAppointment;
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;