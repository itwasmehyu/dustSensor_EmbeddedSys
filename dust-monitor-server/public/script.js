// // Khởi tạo biểu đồ Chart.js
// const ctx = document.getElementById('dustChart').getContext('2d');
// const dustChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: [], // Thời gian
//         datasets: [{
//             label: 'Dust Density (µg/m³)',
//             data: [], // Dữ liệu nồng độ bụi
//             borderColor: 'rgba(75, 192, 192, 1)',
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true, // Biểu đồ luôn bắt đầu từ 0
//                 min: 0 // Ngăn hiển thị giá trị âm trên biểu đồ
//             }
//         }
//     }
// });

// // Hàm cập nhật dữ liệu từ API
// async function updateData() {
//     try {
//         const response = await fetch('/api/dust');
//         const data = await response.json();

//         // Lấy giá trị nồng độ bụi mới nhất và giới hạn tối thiểu là 0
//         let latestValue = data[data.length - 1]?.dust_density || 0;
//         latestValue = Math.max(0, latestValue); // Giới hạn giá trị tối thiểu là 0

//         // Cập nhật ô hiển thị giá trị nồng độ bụi
//         const valueBox = document.getElementById('dustValueBox');
//         valueBox.textContent = `${latestValue.toFixed(1)} µg/m³`;

//         // Kiểm tra và hiển thị cảnh báo nếu nồng độ bụi > 150
//         const warningIcon = document.getElementById('warningIcon');
//         if (latestValue > 150) {
//             warningIcon.style.display = 'inline-block';
//             valueBox.style.backgroundColor = '#ffcccc'; // Đổi màu ô cảnh báo
//         } else {
//             warningIcon.style.display = 'none';
//             valueBox.style.backgroundColor = '#e0f7fa'; // Màu ô bình thường
//         }

//         // Cập nhật dữ liệu biểu đồ
//         dustChart.data.labels = data.map(entry => new Date(entry.timestamp).toLocaleTimeString());
//         dustChart.data.datasets[0].data = data.map(entry => Math.max(0, entry.dust_density)); // Không hiển thị giá trị âm

//         // Giới hạn số lượng mốc thời gian hiển thị
//         if (dustChart.data.labels.length > 10) {
//             dustChart.data.labels = dustChart.data.labels.slice(-10);
//             dustChart.data.datasets[0].data = dustChart.data.datasets[0].data.slice(-10);
//         }

//         // Cập nhật biểu đồ
//         dustChart.update();

//     } catch (error) {
//         console.error('Lỗi khi lấy dữ liệu từ API:', error);
//     }
// }

// // Cập nhật dữ liệu mỗi 5 giây
// setInterval(updateData, 2000);



// // Cấu hình biểu đồ Chart.js
// const ctx = document.getElementById('dustChart').getContext('2d');
// const dustChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: [], // Thời gian
//         datasets: [{
//             label: 'Dust Density (µg/m³)',
//             data: [], // Dữ liệu nồng độ bụi
//             borderColor: 'rgba(75, 192, 192, 1)',
//             borderWidth: 1
//         }]
//     },
//     options: {
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 min: 0
//             }
//         }
//     }
// });

// // Đăng nhập ẩn danh vào Firebase
// firebase.auth().signInAnonymously()
//     .then(() => console.log("Đăng nhập ẩn danh thành công"))
//     .catch((error) => console.error("Lỗi đăng nhập:", error));

// // Hàm cập nhật dữ liệu từ API với xác thực Firebase
// // Hàm cập nhật dữ liệu từ API
// async function updateData() {
//     try {
//         // Lấy token từ Firebase Authentication
//         const user = firebase.auth().currentUser;
//         if (!user) {
//             console.error('Người dùng chưa đăng nhập!');
//             return;
//         }
//         const token = await user.getIdToken();

//         const response = await fetch('/api/dust', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         if (response.status === 401) {
//             console.error('Lỗi xác thực: Token không hợp lệ hoặc thiếu!');
//             return;
//         }

//         const data = await response.json();

//         let latestValue = data[data.length - 1]?.dust_density || 0;
//         latestValue = Math.max(0, latestValue);

//         const valueBox = document.getElementById('dustValueBox');
//         valueBox.textContent = `${latestValue.toFixed(1)} µg/m³`;

//         const warningIcon = document.getElementById('warningIcon');
//         if (latestValue > 150) {
//             warningIcon.style.display = 'inline-block';
//             valueBox.style.backgroundColor = '#ffcccc';
//         } else {
//             warningIcon.style.display = 'none';
//             valueBox.style.backgroundColor = '#e0f7fa';
//         }

//         dustChart.data.labels = data.map(entry => new Date(entry.timestamp).toLocaleTimeString());
//         dustChart.data.datasets[0].data = data.map(entry => Math.max(0, entry.dust_density));

//         if (dustChart.data.labels.length > 10) {
//             dustChart.data.labels = dustChart.data.labels.slice(-10);
//             dustChart.data.datasets[0].data = dustChart.data.datasets[0].data.slice(-10);
//         }

//         dustChart.update();

//     } catch (error) {
//         console.error('Lỗi khi lấy dữ liệu từ API:', error);
//     }
// }


// // Cập nhật dữ liệu mỗi 2 giây
// setInterval(updateData, 2000);







// =============================
// 🟦 TẠO BIỂU ĐỒ BẰNG CHART.JS
// =============================
const ctx = document.getElementById('dustChart').getContext('2d');
const dustChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Thời gian
        datasets: [{
            label: 'Dust Density (µg/m³)',
            data: [], // Dữ liệu nồng độ bụi
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true, // Biểu đồ luôn bắt đầu từ 0
                min: 0 // Ngăn hiển thị giá trị âm trên biểu đồ
            }
        }
    }
});

// ==============================
// 🟩 TẠO BẢN ĐỒ BẰNG LEAFLET.JS
// ==============================
const map = L.map('map').setView([20.9982, 105.8460], 15); // Tọa độ mặc định (Hà Nội, Việt Nam)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Tạo marker hiển thị vị trí và nồng độ bụi
let marker = L.marker([20.9982, 105.8460]).addTo(map);

// ==================================
// 🔄 HÀM CẬP NHẬT DỮ LIỆU TỪ API
// ==================================
async function updateData() {
    try {
        const response = await fetch('/api/dust');
        const data = await response.json();

        // Lấy giá trị nồng độ bụi mới nhất và giới hạn tối thiểu là 0
        let latestValue = data[data.length - 1]?.dust_density || 0;
        latestValue = Math.max(0, latestValue); // Giới hạn giá trị tối thiểu là 0

        // ============================
        // 🟥 Cập nhật ô hiển thị giá trị bụi
        // ============================
        const valueBox = document.getElementById('dustValueBox');
        valueBox.textContent = `${latestValue.toFixed(1)} µg/m³`;

        // ============================
        // ⚠️ Kiểm tra và hiển thị cảnh báo nếu nồng độ bụi > 150
        // ============================
        const warningIcon = document.getElementById('warningIcon');
        if (latestValue > 150) {
            warningIcon.style.display = 'inline-block';
            valueBox.style.backgroundColor = '#ffcccc'; // Đổi màu ô cảnh báo
        } else {
            warningIcon.style.display = 'none';
            valueBox.style.backgroundColor = '#e0f7fa'; // Màu ô bình thường
        }

        // ============================
        // 📊 Cập nhật dữ liệu biểu đồ
        // ============================
        dustChart.data.labels = data.map(entry => new Date(entry.timestamp).toLocaleTimeString());
        dustChart.data.datasets[0].data = data.map(entry => Math.max(0, entry.dust_density));

        if (dustChart.data.labels.length > 10) {
            dustChart.data.labels = dustChart.data.labels.slice(-10);
            dustChart.data.datasets[0].data = dustChart.data.datasets[0].data.slice(-10);
        }
        dustChart.update();
        
        // ============================
        // 📍 Cập nhật vị trí trên bản đồ
        // ============================
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 15);

                // Cập nhật marker vị trí và hiển thị nồng độ bụi trên bản đồ
                marker.setLatLng([latitude, longitude])
                    .bindPopup(`PM2.5: ${latestValue.toFixed(1)} µg/m³`)
                    .openPopup();

            }, error => {
                console.error("Lỗi khi lấy vị trí:", error);
            }, {
                enableHighAccuracy: true, // 🟢 Bật chế độ độ chính xác cao
                timeout: 10000,           // ⏱️ Thời gian chờ tối đa (ms)
                maximumAge: 0             // 🕒 Không sử dụng dữ liệu vị trí cũ
            });
        } else {
            console.error("Trình duyệt không hỗ trợ geolocation.");
        }


    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
    }
}

// ============================
// ⏲️ Cập nhật dữ liệu mỗi 2 giây
// ============================
setInterval(updateData, 2000);
