// ========================================
// S-CROSS Garage
// 車況資料系統
// ========================================

// LocalStorage 使用的資料名稱
const STORAGE_KEY = "sCrossGarageData";

// 預設資料
const defaultData = {
    car: {
        brand: "Suzuki",
        model: "S-CROSS",
        mileage: 25680
    },

    maintenance: [
        {
            id: 1,
            date: "2026-09-01",
            mileage: 20000,
            items: ["機油", "機油芯"],
            cost: 2800,
            note: "定期保養"
        }
    ],

    fuel: [
        {
            id: 1,
            date: "2026-09-28",
            mileage: 25450,
            liters: 35.2,
            pricePerLiter: 33.5,
            total: 1179
        }
    ],

    tires: [
        {
            id: 1,
            brand: "Continental",
            model: "EC6",
            size: "215/55 R17",
            installedMileage: 18000
        }
    ],

    issues: []
};


// ========================================
// 讀取資料
// ========================================

function loadData() {

    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {
        return JSON.parse(savedData);
    }

    // 第一次使用
    saveData(defaultData);

    return defaultData;
}


// ========================================
// 儲存資料
// ========================================

function saveData(data) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


// ========================================
// 取得目前資料
// ========================================

let garageData = loadData();


// ========================================
// 更新目前里程
// ========================================

function updateMileage(mileage) {

    garageData.car.mileage = Number(mileage);

    saveData(garageData);

    renderDashboard();
}


// ========================================
// 新增保養紀錄
// ========================================

function addMaintenance(record) {

    const newRecord = {
        id: Date.now(),
        date: record.date,
        mileage: Number(record.mileage),
        items: record.items,
        cost: Number(record.cost),
        note: record.note || ""
    };

    garageData.maintenance.push(newRecord);

    saveData(garageData);

    renderDashboard();
}


// ========================================
// 新增加油紀錄
// ========================================

function addFuel(record) {

    const newRecord = {
        id: Date.now(),
        date: record.date,
        mileage: Number(record.mileage),
        liters: Number(record.liters),
        pricePerLiter: Number(record.pricePerLiter),
        total: Number(record.total)
    };

    garageData.fuel.push(newRecord);

    saveData(garageData);

    renderDashboard();
}


// ========================================
// 新增輪胎紀錄
// ========================================

function addTire(record) {

    const newRecord = {
        id: Date.now(),
        brand: record.brand,
        model: record.model,
        size: record.size,
        installedMileage: Number(record.installedMileage)
    };

    garageData.tires.push(newRecord);

    saveData(garageData);

    renderDashboard();
}


// ========================================
// 新增異常紀錄
// ========================================

function addIssue(record) {

    const newRecord = {
        id: Date.now(),
        date: record.date,
        mileage: Number(record.mileage),
        title: record.title,
        description: record.description,
        resolved: false
    };

    garageData.issues.push(newRecord);

    saveData(garageData);

    renderDashboard();
}


// ========================================
// 計算本月花費
// ========================================

function calculateMonthlyCost() {

    const now = new Date();

    const currentMonth =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0");


    let total = 0;


    // 保養費用
    garageData.maintenance.forEach(item => {

        if (item.date.startsWith(currentMonth)) {
            total += item.cost;
        }

    });


    // 加油費用
    garageData.fuel.forEach(item => {

        if (item.date.startsWith(currentMonth)) {
            total += item.total;
        }

    });


    return total;
}


// ========================================
// 找到最近一次保養
// ========================================

function getLatestMaintenance() {

    if (garageData.maintenance.length === 0) {
        return null;
    }

    return [...garageData.maintenance]
        .sort(
            (a, b) =>
                b.mileage - a.mileage
        )[0];
}


// ========================================
// 下一次保養里程
// ========================================

function getNextMaintenanceMileage() {

    const latest =
        getLatestMaintenance();

    if (!latest) {
        return 10000;
    }

    return latest.mileage + 10000;
}


// ========================================
// 儀表板
// ========================================

function renderDashboard() {

    console.log("目前車輛資料：");
    console.log(garageData);

    console.log(
        "目前里程：",
        garageData.car.mileage
    );

    console.log(
        "本月花費：",
        calculateMonthlyCost()
    );

    console.log(
        "下次保養：",
        getNextMaintenanceMileage()
    );
}


// ========================================
// 啟動
// ========================================

renderDashboard();