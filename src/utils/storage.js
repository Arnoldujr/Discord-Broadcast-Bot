const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../failed_users.json');

const loadFailed = () => {
    if (!fs.existsSync(filePath)) return new Set();
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return new Set(data);
};

const saveFailed = (set) => {
    fs.writeFileSync(filePath, JSON.stringify(Array.from(set), null, 2));
};

module.exports = { loadFailed, saveFailed };