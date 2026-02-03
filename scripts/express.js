import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// Option A: Create a specific API route that reads the file
app.get('/api/bols', (req, res) => {
    const filePath = path.join(process.cwd(), 'src/data/bol_data.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res
                .status(500)
                .json({ error: 'Could not read BOL data file.' });
        }
        res.json(JSON.parse(data));
    });
});

app.listen(port, () => {
    console.log(
        `🚀 API serving static BOLs at http://localhost:${port}/api/bols`,
    );
});
