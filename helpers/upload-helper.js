const path = require('path');

module.exports = {
    isEmpty: function (obj) {
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    },
    uploadDir: path.join(__dirname, '../public/uploads/')
};