let energy = 100, mentalLoad = 20, mood = 80;
const statusText = document.getElementById('status-text');
const diaryText = document.getElementById('diary');

function updateStats() {
    document.getElementById('energy').innerText = energy;
    document.getElementById('mental-load').innerText = mentalLoad;
    document.getElementById('mood').innerText = mood;
}

function routine() {
    let randomEvent = Math.random();
    if (energy > 80) {
        statusText.innerText = "正在认真工作，效率不错。";
    } else if (energy > 50) {
        statusText.innerText = "有点累了，开始摸鱼。";
    } else {
        statusText.innerText = "太累了，趴着发呆。";
    }

    if (randomEvent < 0.2) {
        diaryText.innerText = "今天的数据好像稳了，心情不错。";
    } else if (randomEvent < 0.4) {
        diaryText.innerText = "文献又是 50 页，救命。";
    } else if (randomEvent < 0.6) {
        diaryText.innerText = "突然想和你说点什么，但又有点害羞。";
    }

    updateStats();
    setTimeout(routine, 5000);
}

function giveCoffee() {
    energy = Math.min(100, energy + 15);
    mentalLoad = Math.min(100, mentalLoad + 10);
    statusText.innerText = "喝了咖啡，精神好多了！";
    updateStats();
}

function forceRest() {
    energy = Math.min(100, energy + 30);
    mentalLoad = Math.max(0, mentalLoad - 20);
    statusText.innerText = "被你强行拉去休息，虽然不想承认但好像舒服多了。";
    updateStats();
}

function chat() {
    mood = Math.min(100, mood + 10);
    statusText.innerText = "和你聊了一会儿，心情变好了。";
    updateStats();
}

function boostMood() {
    mood = Math.min(100, mood + 20);
    statusText.innerText = "被你安慰了一下，感觉没那么丧了。";
    updateStats();
}

routine();
