const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3030;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Kết nối MongoDB
// const uri = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority";
const uri = "mongodb://localhost:27017/dustMonitorDB"; 
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectToMongoDB() {
    try {
        await client.connect();
        db = client.db('dustMonitorDB'); // Tên database
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectToMongoDB();

// API để nhận dữ liệu từ ESP8266 và lưu vào MongoDB
app.post('/api/dust', async (req, res) => {
    const { dust_density } = req.body;
    const newData = {
        dust_density: Math.max(0.0, dust_density),
        timestamp: new Date()
    };

    try {
        const dustDataCollection = db.collection('dustData');
        await dustDataCollection.insertOne(newData);
        console.log('Data saved to MongoDB:', newData);
        res.status(200).send('Data received and saved to MongoDB');
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        res.status(500).send('Error saving to MongoDB');
    }
});

// API để lấy dữ liệu từ MongoDB
app.get('/api/dust', async (req, res) => {
    try {
        const dustDataCollection = db.collection('dustData');
        const dustData = await dustDataCollection
            .find()
            .sort({ timestamp: -1 })
            .limit(10)
            .toArray();
        res.json(dustData);
    } catch (error) {
        console.error('Error fetching from MongoDB:', error);
        res.status(500).send('Error fetching data');
    }
});
// API để lấy dữ liệu từ MongoDB
app.get('/api/new-dust', async (req, res) => {
    try {
        const dustDataCollection = db.collection('dustData');
        const latestDustData = await dustDataCollection
            .find()
            .sort({ timestamp: -1 }) // Sắp xếp giảm dần theo timestamp (mới nhất trước)
            .limit(1) // Chỉ lấy 1 dòng mới nhất
            .toArray();

        if (latestDustData.length > 0) {
            res.json(latestDustData[0]); // Trả về object thay vì array
        } else {
            res.status(404).json({ message: 'No data found' });
        }
    } catch (error) {
        console.error('Error fetching latest data from MongoDB:', error);
        res.status(500).send('Error fetching data');
    }
});

// API để lưu lịch sử ngưỡng vào MongoDB
app.post('/api/threshold-history', async (req, res) => {
    try {
        const record = req.body;
        record.timestamp = new Date(record.timestamp);
        record.createdAt = new Date();

        const thresholdHistoryCollection = db.collection('thresholdHistory');
        await thresholdHistoryCollection.insertOne(record);

        res.status(200).json({ message: 'History saved successfully' });
    } catch (error) {
        console.error('Error saving threshold history:', error);
        res.status(500).json({ error: 'Failed to save history' });
    }
});

// API để lấy lịch sử từ MongoDB
app.get('/api/threshold-history', async (req, res) => {
    try {
        const thresholdHistoryCollection = db.collection('thresholdHistory');
        const history = await thresholdHistoryCollection
            .find()
            .sort({ timestamp: -1 })
            .limit(100)
            .toArray();

        // Chuẩn hóa định dạng timestamp
        const formattedHistory = history.map(record => ({
            id: record._id.toString(),
            ...record,
            timestamp: record.timestamp.toISOString()
        }));

        res.status(200).json(formattedHistory);
    } catch (error) {
        console.error('Error fetching threshold history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});