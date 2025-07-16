module.exports = {
    generateUniqueId: () => {
        return 'id-' + Math.random().toString(36).substr(2, 16);
    },

    formatDate: (date) => {
        return date.toISOString().split('T')[0];
    },

    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    },

    calculateLoyaltyPoints: (amountSpent) => {
        return Math.floor(amountSpent / 10); // 1 point for every $10 spent
    },

    isImage: (file) => {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        return validImageTypes.includes(file.mimetype);
    }
};