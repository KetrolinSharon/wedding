import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DB_PATH = path.resolve(process.cwd(), 'rsvps.json');

// Middleware
app.use(express.json());

// Initialize local database if it doesn't exist
const getDatabase = () => {
  if (!fs.existsSync(DB_PATH)) {
    // Default blessings to populate if empty
    const defaultData = [
      {
        id: "default-1",
        name: "Grand Wedding Organizers",
        attendance: "yes",
        guests: 2,
        message: "Wishing Ketrolin Sharon & Joyal Christo a lifetime of love, laughter, and endless blessing on this beautiful royal union!",
        createdAt: new Date().toISOString()
      }
    ];
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading RSVP database, resetting:", err');
    return [];
  }
};

const saveDatabase = (data: any) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// API Endpoints
app.get('/api/rsvps', (req, res) => {
  try {
    const data = getDatabase();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve RSVPs' });
  }
});

app.post('/api/rsvps', (req, res) => {
  try {
    const { name, attendance, guests, message } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const currentRSVPs = getDatabase();
    const newRSVP = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      name: name.trim(),
      attendance: attendance || 'yes',
      guests: attendance === 'yes' ? (guests || 1) : 0,
      message: (message || '').trim(),
      createdAt: new Date().toISOString()
    };

    currentRSVPs.unshift(newRSVP); // Prepend new blessings
    saveDatabase(currentRSVPs);

    res.status(201).json(newRSVP);
  } catch (error) {
    console.error('Error saving RSVP:', error);
    res.status(500).json({ error: 'Failed to record RSVP' });
  }
});

// Delete RSVP endpoint for convenience
app.delete('/api/rsvps/:id', (req, res) => {
  try {
    const id = req.params.id;
    const currentRSVPs = getDatabase();
    const updated = currentRSVPs.filter((rsvp: any) => rsvp.id !== id);
    saveDatabase(updated);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete RSVP' });
  }
});

// Integration with Vite
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware integrated');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Check if dist folder exists during serving, if not advise build
    if (!fs.existsSync(distPath)) {
      console.warn('Production build fold "dist" not found; serve empty directory or run build first');
    }
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server starting on port ${PORT}`);
  });
}

start();
