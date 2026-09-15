const fs = require('fs');
const path = require('path');

const writeLogToFile = (message, filePath) => {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.appendFileSync(filePath, `${message}\n`, 'utf8');
    } catch (err) {
        console.error('Log write failed:', err.message);
    }
};

module.exports = { writeLogToFile };
