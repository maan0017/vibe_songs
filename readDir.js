const fs = require('fs');
const path = require('path');

const directoryPath = './vibeSongs';

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file ${file}:`, err);
                return;
            }
            console.log(`Contents of ${file}:`);
            console.log(data);
            console.log(); // Adding a newline for better readability
        });
    });
});