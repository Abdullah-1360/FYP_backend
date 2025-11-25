const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Medicine = require('../models/Medicine');
const Payment = require('../models/Payment');

// Get comprehensive analytics
exports.getAnalytics = async (req, res) => {
    try {
        // Fetch all data in parallel
        const [users, doctors, medicines, payments] = await Promise.all([
            User.find(),
            Doctor.find(),
            Medicine.find(),
            Payment.find({ status: 'succeeded' })
        ]);

        // User Analytics
        const totalUsers = users.length;
        const activeUsers = users.filter(u => !u.isBlocked).length;
        const blockedUsers = users.filter(u => u.isBlocked).length;
        
        // Monthly user registrations
        const monthlyRegistrations = {};
        users.forEach(user => {
            if (user.createdAt) {
                const date = new Date(user.createdAt);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                monthlyRegistrations[monthKey] = (monthlyRegistrations[monthKey] || 0) + 1;
            }
        });

        // Users by role
        const usersByRole = {};
        users.forEach(user => {
            const role = user.role || 'user';
            usersByRole[role] = (usersByRole[role] || 0) + 1;
        });

        // Doctor Analytics
        const totalDoctors = doctors.length;
        const doctorsBySpecialization = {};
        const doctorsByExperience = {
            '0-2 years': 0,
            '3-5 years': 0,
            '6-10 years': 0,
            '10+ years': 0
        };
        
        let totalRating = 0;
        let ratedDoctors = 0;
        
        doctors.forEach(doctor => {
            // Specialization
            const spec = doctor.specialization || 'General';
            doctorsBySpecialization[spec] = (doctorsBySpecialization[spec] || 0) + 1;
            
            // Experience
            const exp = doctor.experience || 0;
            if (exp <= 2) doctorsByExperience['0-2 years']++;
            else if (exp <= 5) doctorsByExperience['3-5 years']++;
            else if (exp <= 10) doctorsByExperience['6-10 years']++;
            else doctorsByExperience['10+ years']++;
            
            // Rating
            if (doctor.ratings && doctor.ratings.length > 0) {
                const avgRating = doctor.ratings.reduce((a, b) => a + b, 0) / doctor.ratings.length;
                totalRating += avgRating;
                ratedDoctors++;
            }
        });
        
        const averageRating = ratedDoctors > 0 ? totalRating / ratedDoctors : 0;

        // Medicine Analytics
        const totalMedicines = medicines.length;
        const lowStockMedicines = medicines.filter(m => (m.stock || 0) < 10 && (m.stock || 0) > 0).length;
        const outOfStockMedicines = medicines.filter(m => (m.stock || 0) === 0).length;
        
        const medicinesByCategory = {};
        const revenueByCategory = {};
        let totalInventoryValue = 0;
        
        medicines.forEach(medicine => {
            const category = medicine.category || 'Other';
            const price = medicine.price || 0;
            const stock = medicine.stock || 0;
            
            medicinesByCategory[category] = (medicinesByCategory[category] || 0) + 1;
            
            const value = price * stock;
            revenueByCategory[category] = (revenueByCategory[category] || 0) + value;
            totalInventoryValue += value;
        });

        // Appointment Analytics
        let totalAppointments = 0;
        let pendingAppointments = 0;
        let confirmedAppointments = 0;
        let completedAppointments = 0;
        let cancelledAppointments = 0;
        const appointmentsByMonth = {};
        const appointmentsByDoctor = {};
        const appointmentsByStatus = {
            pending: 0,
            confirmed: 0,
            approved: 0,
            completed: 0,
            cancelled: 0
        };
        
        doctors.forEach(doctor => {
            if (doctor.appointments && doctor.appointments.length > 0) {
                doctor.appointments.forEach(apt => {
                    totalAppointments++;
                    
                    const status = (apt.status || 'pending').toLowerCase();
                    appointmentsByStatus[status] = (appointmentsByStatus[status] || 0) + 1;
                    
                    if (status === 'pending') pendingAppointments++;
                    else if (status === 'confirmed' || status === 'approved') confirmedAppointments++;
                    else if (status === 'completed') completedAppointments++;
                    else if (status === 'cancelled') cancelledAppointments++;
                    
                    // Monthly appointments
                    if (apt.appointmentDate) {
                        const date = new Date(apt.appointmentDate);
                        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                        appointmentsByMonth[monthKey] = (appointmentsByMonth[monthKey] || 0) + 1;
                    }
                    
                    // By doctor
                    const doctorName = doctor.name || 'Unknown';
                    appointmentsByDoctor[doctorName] = (appointmentsByDoctor[doctorName] || 0) + 1;
                });
            }
        });

        // Revenue Analytics
        const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const monthlyRevenue = {};
        
        payments.forEach(payment => {
            if (payment.createdAt) {
                const date = new Date(payment.createdAt);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (payment.amount || 0);
            }
        });
        
        const totalOrders = payments.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Compile response
        const analytics = {
            summary: {
                totalUsers,
                totalDoctors,
                totalMedicines,
                totalAppointments,
                totalRevenue,
                activeUsers,
                lowStockMedicines,
                pendingAppointments
            },
            users: {
                totalUsers,
                activeUsers,
                blockedUsers,
                monthlyRegistrations,
                usersByRole
            },
            doctors: {
                totalDoctors,
                doctorsBySpecialization,
                doctorsByExperience,
                averageRating
            },
            medicines: {
                totalMedicines,
                lowStockMedicines,
                outOfStockMedicines,
                medicinesByCategory,
                revenueByCategory,
                totalInventoryValue
            },
            appointments: {
                totalAppointments,
                pendingAppointments,
                confirmedAppointments,
                completedAppointments,
                cancelledAppointments,
                appointmentsByMonth,
                appointmentsByDoctor,
                appointmentsByStatus
            },
            revenue: {
                totalRevenue,
                monthlyRevenue,
                revenueByCategory,
                averageOrderValue,
                totalOrders
            }
        };

        res.status(200).json(analytics);
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Error retrieving analytics', error: error.message });
    }
};

// Get dashboard summary
exports.getDashboardSummary = async (req, res) => {
    try {
        const [userCount, doctorCount, medicineCount, payments] = await Promise.all([
            User.countDocuments(),
            Doctor.countDocuments(),
            Medicine.countDocuments(),
            Payment.find({ status: 'succeeded' })
        ]);

        const activeUsers = await User.countDocuments({ isBlocked: false });
        const lowStockMedicines = await Medicine.countDocuments({ stock: { $lt: 10, $gt: 0 } });
        
        // Count pending appointments
        const doctors = await Doctor.find();
        let pendingAppointments = 0;
        doctors.forEach(doctor => {
            if (doctor.appointments) {
                pendingAppointments += doctor.appointments.filter(apt => 
                    (apt.status || 'pending').toLowerCase() === 'pending'
                ).length;
            }
        });

        const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

        res.status(200).json({
            totalUsers: userCount,
            totalDoctors: doctorCount,
            totalMedicines: medicineCount,
            totalRevenue,
            activeUsers,
            lowStockMedicines,
            pendingAppointments
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving dashboard summary', error: error.message });
    }
};
