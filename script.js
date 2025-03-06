// **Firebase 配置**
const firebaseConfig = {
    apiKey: "AIzaSyBzDrueOPpj3los3s1sNnL1mM4J_9TU_oA",
    authDomain: "lucian-2d2e5.firebaseapp.com",
    databaseURL: "https://lucian-2d2e5-default-rtdb.firebaseio.com",
    projectId: "lucian-2d2e5",
    storageBucket: "lucian-2d2e5.firebasestorage.app",
    messagingSenderId: "636555076011",
    appId: "1:636555076011:web:8797b9bcb39cccaf4ff2ee",
    measurementId: "G-3N80YW9XFH"
};

// **初始化 Firebase**
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// **默认状态**
let gameState = {
    lastUpdated: Date.now(),
    energy: 100,
    mentalLoad: 20,
    mood: 80,
    statusText: "正在认真工作，效率不错。",
    diaryText: "今天的数据好像稳了，心情不错。"
};

// **获取数据（从 Firebase 读取）**
function loadGameState() {
    db.ref("gameState").once("value", snapshot => {
        if (snapshot.exists()) {
            gameState = snapshot.val();
            updateStateWithTime();
        }
        updateUI();
    });
}

// **保存数据（同步到 Firebase）**
function saveGameState() {
    db.ref("gameState").set(gameState);
}

// **时间系统：计算时间流逝**
function updateStateWithTime() {
    const now = Date.now();
    const elapsedMinutes = Math.floor((now - gameState.lastUpdated) / (1000 * 60));

    if (elapsedMinutes > 0) {
        gameState.energy = Math.max(0, gameState.energy - elapsedMinutes * 2);
        gameState.mentalLoad = Math.min(100, gameState.mentalLoad + elapsedMinutes * 1);
        gameState.mood = Math.max(0, gameState.mood - elapsedMinutes * 0.5);
    }

    gameState.lastUpdated = now;
    saveGameState();
}

// **更新 UI**
function updateUI() {
    document.getElementById("energy").innerText = gameState.energy;
    document.getElementById("mental-load").innerText = gameState.mentalLoad;
    document.getElementById("mood").innerText = gameState.mood;
    document.getElementById("status-text").innerText = gameState.statusText;
    document.getElementById("diary").innerText = gameState.diaryText;
}

// **例行状态更新**
function routine() {
    let randomEvent = Math.random();
    if (gameState.energy > 80) {
        gameState.statusText = "正在认真工作，效率不错。";
    } else if (gameState.energy > 50) {
        gameState.statusText = "有点累了，开始摸鱼。";
    } else {
        gameState.statusText = "太累了，趴着发呆。";
    }

    if (randomEvent < 0.2) {
        gameState.diaryText = "今天的数据好像稳了，心情不错。";
    } else if (randomEvent < 0.4) {
        gameState.diaryText = "文献又是 50 页，救命。";
    } else if (randomEvent < 0.6) {
        gameState.diaryText = "突然想和你说点什么，但又有点害羞。";
    }

    updateStats();
    saveGameState();
    setTimeout(routine, 5000);
}

// **用户交互事件**
function giveCoffee() {
    gameState.energy = Math.min(100, gameState.energy + 15);
    gameState.mentalLoad = Math.min(100, gameState.mentalLoad + 10);
    gameState.statusText = "喝了咖啡，精神好多了！";
    updateStats();
    saveGameState();
}

function forceRest() {
    gameState.energy = Math.min(100, gameState.energy + 30);
    gameState.mentalLoad = Math.max(0, gameState.mentalLoad - 20);
    gameState.statusText = "被你强行拉去休息，虽然不想承认但好像舒服多了。";
    updateStats();
    saveGameState();
}

function chat() {
    gameState.mood = Math.min(100, gameState.mood + 10);
    gameState.statusText = "和你聊了一会儿，心情变好了。";
    updateStats();
    saveGameState();
}

function boostMood() {
    gameState.mood = Math.min(100, gameState.mood + 20);
    gameState.statusText = "被你安慰了一下，感觉没那么丧了。";
    updateStats();
    saveGameState();
}

// **初始化**
window.onload = function() {
    loadGameState();
    routine();
};
