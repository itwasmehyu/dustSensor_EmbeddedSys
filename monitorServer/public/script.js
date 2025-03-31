const ctx = document.getElementById('dustChart').getContext('2d');
const dustChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Thời gian
        datasets: [{
            label: 'Dust Density (µg/m³)',
            data: [], // Dữ liệu nồng độ bụi
            borderColor: '#000000',
            borderWidth: 2.5,
            fill: false,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: '#000000',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointHoverRadius: 6,
            pointHoverBorderWidth: 3
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: 200, // Đặt giới hạn tối đa để hiển thị đầy đủ các vùng
                grid: {
                    drawBorder: false
                }
            }
        },
        plugins: {
            annotation: {
                annotations: {
                    box1: {
                        type: 'box',
                        yMin: 0,
                        yMax: 100,
                        backgroundColor: 'rgba(0, 0, 255, 0.3)',
                        borderColor: 'transparent'
                    },
                    box2: {
                        type: 'box',
                        yMin: 100,
                        yMax: 125,
                        backgroundColor: 'rgba(0, 0, 255, 0.3)',
                        borderColor: 'transparent'
                    },
                    box3: {
                        type: 'box',
                        yMin: 125,
                        yMax: 150,
                        backgroundColor: 'rgba(255, 165, 0, 0.3)',
                        borderColor: 'transparent'
                    },
                    box4: {
                        type: 'box',
                        yMin: 150,
                        yMax: 175,
                        backgroundColor: 'rgba(255, 0, 0, 0.33)',
                        borderColor: 'transparent'
                    },
                    box5: {
                        type: 'box',
                        yMin: 175,
                        yMax: 200,
                        backgroundColor: 'rgba(139, 0, 0, 0.3)',
                        borderColor: 'transparent'
                    }
                }
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

// Thêm debug để theo dõi chuyển động của bản đồ
map.on('movestart', function(e) {
    console.log('Map move started', e);
    console.trace('Map move trace'); // In ra stack trace
});

// Tạo marker hiển thị vị trí chính và nồng độ bụi
let mainMarker = L.marker([20.9982, 105.8460]).addTo(map);

// Màu sắc dựa trên mức độ ô nhiễm
function getMarkerColor(value) {
    if (value > 175) return 'darkred';
    if (value > 150) return 'red';
    if (value > 125) return 'orange';
    return 'blue';
}

// Biểu tượng tùy chỉnh cho các trạm đo
function createCustomIcon(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [15, 15],
        iconAnchor: [7, 7]
    });
}

// Mảng lưu các marker trạm đo
let stationMarkers = [];

// Dữ liệu giả lập cho các trạm đo
const mockLocations = [
    {
        id: 1,
        name: 'Trạm đo 1',
        position: [20.9982 + 0.003, 105.8460 + 0.004],
        dust_density: getRandomDustValue()
    },
    {
        id: 2,
        name: 'Trạm đo 2',
        position: [20.9982 - 0.002, 105.8460 + 0.003],
        dust_density: getRandomDustValue()
    },
    {
        id: 3,
        name: 'Trạm đo 3',
        position: [20.9982 + 0.001, 105.8460 - 0.005],
        dust_density: getRandomDustValue()
    },
    {
        id: 4,
        name: 'Trạm đo 4',
        position: [20.9982 - 0.004, 105.8460 - 0.002],
        dust_density: getRandomDustValue()
    },
    {
        id: 5,
        name: 'Trạm đo 5',
        position: [20.9982 + 0.005, 105.8460 - 0.001],
        dust_density: getRandomDustValue()
    }
];

// Hàm tạo giá trị ngẫu nhiên từ 100-200 cho nồng độ bụi
function getRandomDustValue() {
    return Math.floor(Math.random() * 101) + 100; // Giá trị từ 100-200
}

// Hàm cập nhật giá trị bụi mới cho các trạm đo
function updateMockData() {
    mockLocations.forEach(location => {
        location.dust_density = getRandomDustValue();
    });
    return mockLocations;
}

// Hàm khởi tạo các marker ban đầu
function initializeStationMarkers() {
    // Xóa marker cũ nếu có
    stationMarkers.forEach(marker => map.removeLayer(marker));
    stationMarkers = [];
    
    // Tạo marker mới cho mỗi trạm đo
    mockLocations.forEach(station => {
        const color = getMarkerColor(station.dust_density);
        const icon = createCustomIcon(color);
        
        const marker = L.marker(station.position, {icon: icon})
            .addTo(map)
            .bindPopup(`<b>${station.name}</b><br>PM2.5: ${station.dust_density.toFixed(1)} µg/m³`);
        
        stationMarkers.push(marker);
    });
}

// Hàm cập nhật marker cho các trạm đo
function updateStationMarkers() {
    // Cập nhật dữ liệu mới
    updateMockData();
    
    // Cập nhật marker với dữ liệu mới
    mockLocations.forEach((station, index) => {
        const color = getMarkerColor(station.dust_density);
        const icon = createCustomIcon(color);
        
        stationMarkers[index].setIcon(icon);
        stationMarkers[index].setPopupContent(`<b>${station.name}</b><br>PM2.5: ${station.dust_density.toFixed(1)} µg/m³`);
    });
}

// Thêm biến để lưu giá trị ngưỡng
let warningThreshold = 150;

// Thêm biến để lưu trữ lịch sử vượt ngưỡng
let thresholdHistory = [];
let currentViolation = null;

// Hàm lưu lịch sử vào Firestore
async function saveHistoryToFirestore(record) {
    try {
        const response = await fetch('/api/threshold-history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(record)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save history');
        }
    } catch (error) {
        console.error('Error saving history:', error);
        // Fallback to localStorage if API fails
        localStorage.setItem('pendingHistory', JSON.stringify(record));
    }
}

// Hàm load lịch sử từ Firestore
async function loadHistoryFromFirestore() {
    try {
        const response = await fetch('/api/threshold-history');
        if (!response.ok) {
            throw new Error('Failed to load history');
        }
        
        const data = await response.json();
        thresholdHistory = data.map(record => ({
            ...record,
            timestamp: new Date(record.timestamp)
        }));
        
        // Check for any pending records in localStorage
        const pendingHistory = localStorage.getItem('pendingHistory');
        if (pendingHistory) {
            const record = JSON.parse(pendingHistory);
            thresholdHistory.push({
                ...record,
                timestamp: new Date(record.timestamp)
            });
            // Try to sync pending record
            await saveHistoryToFirestore(record);
            localStorage.removeItem('pendingHistory');
        }
        
        updateHistoryTable();
    } catch (error) {
        console.error('Error loading history:', error);
        // Fallback to localStorage
        loadFromLocalStorageFallback();
    }
}

// Fallback function để load từ localStorage
function loadFromLocalStorageFallback() {
    const savedHistory = localStorage.getItem('thresholdHistory');
    if (savedHistory) {
        thresholdHistory = JSON.parse(savedHistory).map(record => ({
            ...record,
            timestamp: new Date(record.timestamp)
        }));
        updateHistoryTable();
    }
}

// Load lịch sử khi trang được khởi động
document.addEventListener('DOMContentLoaded', function() {
    const thresholdSlider = document.getElementById('thresholdSlider');
    const thresholdValue = document.getElementById('thresholdValue');

    // Load saved threshold value
    const savedThreshold = localStorage.getItem('warningThreshold');
    if (savedThreshold) {
        warningThreshold = parseInt(savedThreshold);
        thresholdSlider.value = warningThreshold;
        thresholdValue.textContent = warningThreshold;
    }

    thresholdSlider.addEventListener('input', function() {
        warningThreshold = parseInt(this.value);
        thresholdValue.textContent = warningThreshold;
        localStorage.setItem('warningThreshold', warningThreshold);
    });

    // Load history from Firestore
    loadHistoryFromFirestore();
});

// Modal elements
const modal = document.getElementById('thresholdModal');
const showHistoryBtn = document.getElementById('showHistoryBtn');
const closeBtn = document.querySelector('.close');

// Xử lý sự kiện cho modal
showHistoryBtn.onclick = function() {
    modal.style.display = "block";
    updateHistoryTable();
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Hàm tính toán mức độ nghiêm trọng
function calculateSeverity(value, threshold) {
    const difference = value - threshold;
    if (difference <= 10) return { level: 'low', text: 'Low' };
    if (difference <= 25) return { level: 'medium', text: 'Medium' };
    if (difference <= 50) return { level: 'high', text: 'High' };
    return { level: 'critical', text: 'Critical' };
}

// Hàm định dạng thời gian
function formatDuration(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

// Hàm cập nhật bảng lịch sử
function updateHistoryTable() {
    const tbody = document.getElementById('thresholdHistoryBody');
    tbody.innerHTML = '';

    thresholdHistory.slice().reverse().forEach(record => {
        const row = document.createElement('tr');
        const severity = calculateSeverity(record.value, record.threshold);
        
        row.innerHTML = `
            <td>${new Date(record.timestamp).toLocaleString()}</td>
            <td>${record.value.toFixed(1)} µg/m³</td>
            <td>${record.threshold} µg/m³</td>
            <td>${formatDuration(record.duration)}</td>
            <td class="severity-${severity.level}">${severity.text}</td>
        `;
        
        tbody.appendChild(row);
    });
}

async function updateData() {
    try {
        const response = await fetch('/api/dust');
        const data = await response.json();

        let latestValue = data[data.length - 1]?.dust_density || 0;
        latestValue = Math.max(0, latestValue);

        const valueBox = document.getElementById('dustValueBox');
        const warningIcon = document.getElementById('warningIcon');
        
        valueBox.textContent = `${latestValue.toFixed(1)} µg/m³`;

        // Kiểm tra và cập nhật trạng thái vượt ngưỡng
        if (latestValue > warningThreshold) {
            warningIcon.style.display = 'inline-block';
            warningIcon.classList.add('warning-active');
            valueBox.style.backgroundColor = '#ffcccc';

            if (!currentViolation) {
                currentViolation = {
                    timestamp: new Date(),
                    value: latestValue,
                    threshold: warningThreshold,
                    duration: 0
                };
            } else {
                currentViolation.duration += 2;
                currentViolation.value = Math.max(currentViolation.value, latestValue);
            }
        } else {
            warningIcon.style.display = 'none';
            warningIcon.classList.remove('warning-active');
            valueBox.style.backgroundColor = '#e0f7fa';

            if (currentViolation) {
                const violationRecord = {...currentViolation};
                thresholdHistory.push(violationRecord);
                await saveHistoryToFirestore(violationRecord);
                currentViolation = null;

                if (thresholdHistory.length > 100) {
                    thresholdHistory = thresholdHistory.slice(-100);
                }
                updateHistoryTable();
            }
        }

        // Cập nhật biểu đồ
        dustChart.data.labels = data.map(entry => {
            // MongoDB trả về timestamp dạng ISO string hoặc Date object
            let date = new Date(entry.timestamp);
            return date.toLocaleTimeString();
        });
        
        dustChart.data.datasets[0].data = data.map(entry => Math.max(0, entry.dust_density));

        if (dustChart.data.labels.length > 10) {
            dustChart.data.labels = dustChart.data.labels.slice(-10);
            dustChart.data.datasets[0].data = dustChart.data.datasets[0].data.slice(-10);
        }
        dustChart.update();

        // Cập nhật bản đồ
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                mainMarker.setLatLng([latitude, longitude])
                    .bindPopup(`<b>Vị trí hiện tại</b><br>PM2.5: ${latestValue.toFixed(1)} µg/m³`);
                updateStationMarkers();
            }, error => {
                console.error("Lỗi khi lấy vị trí:", error);
                updateStationMarkers();
            }, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        } else {
            console.error("Trình duyệt không hỗ trợ geolocation.");
            updateStationMarkers();
        }

    } catch (error) {
        console.error('Error in updateData:', error);
        updateStationMarkers();
    }
}


// Khởi tạo các marker trạm đo khi trang web được load
initializeStationMarkers();

// ============================
// ⏲️ Cập nhật dữ liệu mỗi 2 giây
// ============================
setInterval(updateData, 2000);
