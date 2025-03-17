// File mockdata.js
// Các vị trí mockup xung quanh vị trí chính
// Tọa độ gốc: [20.9982, 105.8460] (Hà Nội, Việt Nam)

// Tạo các điểm xung quanh vị trí chính với offset nhỏ
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

// Hàm cập nhật giá trị bụi mới
function updateMockData() {
    mockLocations.forEach(location => {
        location.dust_density = getRandomDustValue();
    });
    return mockLocations;
}