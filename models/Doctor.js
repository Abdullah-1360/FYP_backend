const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    ratings: {
        type: [Number],
        default: []
    },
    appointments: [{
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
    }],
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add method to check appointment availability
doctorSchema.methods.isTimeSlotAvailable = function(appointmentDate) {
    const existingAppointment = this.appointments.find(appointment => 
        appointment.appointmentDate.getTime() === appointmentDate.getTime() && 
        appointment.status !== 'cancelled'
    );
    return !existingAppointment;
};

// Add index to prevent double booking
doctorSchema.index({ 'appointments.appointmentDate': 1 });

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;