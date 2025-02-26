// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path'); // Thêm thư viện path

// const app = express();
// const port = 3030;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // Phục vụ file tĩnh từ thư mục 'public'
// app.use(express.static(path.join(__dirname, 'public')));

// // Route cho đường dẫn gốc
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Lưu trữ dữ liệu (tối đa 10 giá trị)
// let dustData = [];
// const MAX_DATA_POINTS = 10; // Giới hạn số lượng mốc thời gian

// // API để nhận dữ liệu từ ESP8266
// app.post('/api/dust', (req, res) => {
//   const { dust_density } = req.body;

//   // Thêm dữ liệu mới
//   dustData.push({ dust_density, timestamp: new Date() });

//   // Giới hạn mảng chỉ chứa 10 giá trị gần nhất
//   if (dustData.length > MAX_DATA_POINTS) {
//     dustData = dustData.slice(-MAX_DATA_POINTS); // Giữ lại 10 giá trị cuối cùng
//   }

//   res.status(200).send('Data received');
// });

// // API để lấy dữ liệu hiển thị lên trang web
// app.get('/api/dust', (req, res) => {
//   res.json(dustData);
// });

// // Khởi động máy chủ
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

//******************************************************************************************/

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Firebase Admin SDK
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Khởi tạo Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
const port = 3030;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Phục vụ file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route cho đường dẫn gốc
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Lưu trữ dữ liệu (tối đa 10 giá trị hiển thị trên chart)
let dustData = [];
const MAX_DATA_POINTS = 10;

// API để nhận dữ liệu từ ESP8266 và lưu vào Firebase
app.post('/api/dust', async (req, res) => {
    const { dust_density } = req.body;
    const newData = {
        dust_density: Math.max(0.0, dust_density), // Không cho giá trị âm
        timestamp: new Date()
    };

    // Lưu vào Firestore
    try {
        await db.collection('dustData').add(newData);
        console.log('Data saved to Firebase:', newData);
    } catch (error) {
        console.error('Error saving to Firebase:', error);
        return res.status(500).send('Error saving to Firebase');
    }

    // Cập nhật mảng dữ liệu cục bộ để hiển thị biểu đồ
    dustData.push(newData);
    if (dustData.length > MAX_DATA_POINTS) {
        dustData = dustData.slice(-MAX_DATA_POINTS);
    }

    res.status(200).send('Data received and saved to Firebase');
});

// API để lấy dữ liệu hiển thị lên trang web
app.get('/api/dust', (req, res) => {
    res.json(dustData);
});

// Khởi động máy chủ
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path');

// // Firebase Admin SDK
// const admin = require('firebase-admin');
// const serviceAccount = require('./serviceAccountKey.json');

// // Khởi tạo Firebase
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// const db = admin.firestore();

// const app = express();
// const port = 3030;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // Phục vụ file tĩnh từ thư mục 'public'
// app.use(express.static(path.join(__dirname, 'public')));

// // Route cho đường dẫn gốc
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// // Middleware xác thực người dùng qua Firebase
// async function authenticateToken(req, res, next) {
//   const token = req.headers.authorization?.split('Bearer ')[1];
  
//   if (!token) {
//       return res.status(401).json({ message: 'Thiếu token xác thực!' });
//   }

//   try {
//       const decodedToken = await admin.auth().verifyIdToken(token);
//       req.user = decodedToken;
//       next();
//   } catch (error) {
//       console.error('Lỗi xác thực token:', error);
//       return res.status(403).json({ message: 'Token không hợp lệ!' });
//   }
// }
// async function authenticateToken(req, res, next) {
//   const token = req.headers.authorization?.split('Bearer ')[1];
  
//   if (!token) {
//       return res.status(401).json({ message: 'Thiếu token xác thực!' });
//   }

//   try {
//       const decodedToken = await admin.auth().verifyIdToken(token);
//       req.user = decodedToken;
//       next();
//   } catch (error) {
//       console.error('Lỗi xác thực token:', error);
//       return res.status(403).json({ message: 'Token không hợp lệ!' });
//   }
// }

// // API để nhận dữ liệu từ ESP8266 và lưu vào Firebase
// app.post('/api/dust', authenticateToken, async (req, res) => {
//     const { dust_density } = req.body;
//     const newData = {
//         dust_density: Math.max(0.0, dust_density), // Không cho giá trị âm
//         timestamp: new Date()
//     };

//     // Lưu vào Firestore
//     try {
//         await db.collection('dustData').add(newData);
//         console.log('Data saved to Firebase:', newData);
//         res.status(200).send('Data received and saved to Firebase');
//     } catch (error) {
//         console.error('Error saving to Firebase:', error);
//         res.status(500).send('Error saving to Firebase');
//     }
// });

// // API để lấy dữ liệu hiển thị lên trang web
// app.get('/api/dust', authenticateToken, async (req, res) => {
//     try {
//         const snapshot = await db.collection('dustData')
//             .orderBy('timestamp', 'desc')
//             .limit(10)
//             .get();

//         const dustData = snapshot.docs.map(doc => doc.data());
//         res.json(dustData.reverse()); // Đảo ngược để hiển thị theo thời gian tăng dần
//     } catch (error) {
//         console.error('Error fetching data from Firebase:', error);
//         res.status(500).send('Error fetching data from Firebase');
//     }
// });

// // Khởi động máy chủ
// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });
