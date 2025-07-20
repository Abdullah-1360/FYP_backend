/**
 * Constructs a full URL from a potentially relative path
 * @param {string} fileUrl - The file URL which may be relative
 * @param {object} req - Express request object (optional)
 * @returns {string} - The full URL
 */
const getFullUrl = (fileUrl, req = null) => {
    if (!fileUrl) return null;
    
    // If already a full URL, return as is
    if (fileUrl.startsWith('http')) return fileUrl;
    
    // Remove leading slash if present
    if (fileUrl.startsWith('/')) fileUrl = fileUrl.substring(1);
    
    // Get base URL from environment or construct from request
    let baseUrl;
    if (process.env.SERVER_URL) {
        baseUrl = process.env.SERVER_URL;
    } else if (req) {
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.headers['x-forwarded-host'] || req.get('host');
        baseUrl = `${protocol}://${host}`;
    } else {
        // Fallback to localhost with port from env or default
        const host = process.env.HOST || 'localhost';
        const port = process.env.PORT || 5000;
        baseUrl = `http://${host}:${port}`;
    }
    
    // Ensure baseUrl doesn't end with slash
    if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
    }
    
    return `${baseUrl}/${fileUrl}`;
};

module.exports = {
    getFullUrl,
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