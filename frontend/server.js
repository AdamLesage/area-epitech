import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
