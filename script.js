

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
    return db.ref("gameState").once("value")
        .then(snapshot => {
            if (snapshot.exists()) {
                gameState = snapshot.val(); // 更新本地游戏状态
                console.log("🔥 成功加载游戏数据：", gameState);
                updateStats(); // 更新 UI
            } else {
                console.log("⚠️ 没有找到游戏数据，使用默认值。");
            }
        })
        .catch(error => {
            console.error("❌ 加载游戏数据失败：", error);
        });
}



// **保存数据（同步到 Firebase）**
window.saveGameState = function() {
    console.log("🔥 正在保存数据到 Firebase...", gameState);
    db.ref("gameState").set(gameState)
        .then(() => console.log("✅ 数据保存成功！"))
        .catch(err => console.error("❌ 数据保存失败：", err));
};



// **时间系统：计算时间流逝**
function updateStateWithTime() {
    const now = Date.now();
    const timeElapsed = Math.floor((now - gameState.lastUpdated) / 60000); // 计算过去了多少分钟

    if (timeElapsed > 0) {
        console.log(`⏳ 过去了 ${timeElapsed} 分钟，调整状态中...`);
        gameState.energy = Math.max(0, gameState.energy - timeElapsed * 2); // 每分钟消耗 2 点能量
        gameState.mood = Math.max(0, gameState.mood - Math.floor(timeElapsed / 5)); // 每 5 分钟掉 1 点心情
    }

    gameState.lastUpdated = now; // 记录新时间
    updateStats(); // 更新 UI
    saveGameState(); // 保存新状态
}


//时钟
function updateClock() {
    const now = getBeijingTime();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById("current-time").innerText = `${hours}:${minutes}`;
}


// **更新 UI**
function updateUI() {
    document.getElementById("energy").innerText = gameState.energy;
    document.getElementById("mental-load").innerText = gameState.mentalLoad;
    document.getElementById("mood").innerText = gameState.mood;
    document.getElementById("status-text").innerText = gameState.statusText;
    document.getElementById("diary").innerText = gameState.diaryText;
}

//更新数据
function updateStats() {
    document.getElementById("energy").innerText = gameState.energy;
    document.getElementById("mental-load").innerText = gameState.mentalLoad;
    document.getElementById("mood").innerText = gameState.mood;
    document.getElementById("status-text").innerText = gameState.statusText;
    document.getElementById("diary").innerText = gameState.diaryText;
    gameState.energy = Math.round(gameState.energy);
    gameState.mentalLoad = Math.round(gameState.mentalLoad);
    gameState.mood = Math.round(gameState.mood);

}

// **例行状态更新**
function routine() {
    const now = getBeijingTime().getTime(); // ✅ 确保用的是北京时间
    const timeSinceLastUpdate = Math.floor((now - gameState.lastUpdated) / 60000); // 计算过去了多少分钟

    // **只有时间间隔超过 30 分钟，才更新状态**
    if (timeSinceLastUpdate >= 30) {
        // 🔋 **减少精力**
        gameState.energy = Math.max(0, gameState.energy - 10);

        // 🧠 **增加思维负荷**
        gameState.mentalLoad = Math.min(100, gameState.mentalLoad + 5);

        // 😌 **心情变化（如果思维负荷太高，心情会下降）**
        if (gameState.mentalLoad >= 80) {
            gameState.mood = Math.max(0, gameState.mood - 10);
        } else {
            gameState.mood = Math.min(100, gameState.mood + 5);
        }

        // 📖 **更新日记**
        const randomEvent = Math.random();
        if (randomEvent < 0.2) {
            gameState.diaryText = "今天的实验有点意思，感觉数据稳定了。";
        } else if (randomEvent < 0.4) {
            gameState.diaryText = "文献又是 50 页，救命。";
        } else if (randomEvent < 0.6) {
            gameState.diaryText = "突然想和你说点什么，但又有点害羞。";
        } else {
            gameState.diaryText = "最近感觉还不错，就是有点累。";
        }

        gameState.lastUpdated = now; // 记录新更新时间
        saveGameState(); // 保存状态
    }

    setTimeout(routine, 1800000); // **30 分钟后再次执行**
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
    loadGameState().then(() => {
        updateStateWithTime(); // 计算过去时间
        routine(); // 开始循环状态变化
        setInterval(updateClock, 1000); // 开始时钟更新
    });
};



