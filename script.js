document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.querySelector('.game-container');
    const tabBar = document.querySelector('.tab-bar');
    const tabAdd = document.querySelector('.tab-add');
    let currentGameIndex = 0;
    const MAX_GAMES = 7;
    const gameData = [];
function createGameTab(index) {
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.textContent = `เกม ${index + 1}`;
    tab.addEventListener('click', () => switchGame(index));
    tabBar.insertBefore(tab, tabAdd);
}
function createGameContent(index) {
    const gameWrapper = document.createElement('div');
    gameWrapper.className = 'game';
    gameWrapper.dataset.index = index;
    gameWrapper.innerHTML = `
        <div class="ban-pick" id="ban-pick-${index}"> 
            <div id="team1-container">
            <div class="hero-choose" id="AbyssalDragon1"><img src="/assest/etc/AbyssalDragon.webp" data-default="/assest/etc/AbyssalDragon.webp"></div>
            <div class="hero-choose" id="Support1"><img src="/assest/etc/Support.webp" data-default="/assest/etc/Support.webp"></div>
            <div class="hero-choose" id="Mid1">  <img src="/assest/etc/Mid.webp" data-default="/assest/etc/Mid.webp"></div>
            <div class="hero-choose" id="Jungle1"><img src="/assest/etc/Jungle.webp" data-default="/assest/etc/Jungle.webp"></div>
            <div class="hero-choose" id="DarkSlayer1"><img src="/assest/etc/DarkSlayer.webp" data-default="/assest/etc/DarkSlayer.webp"></div>
            </div>
            <div class="ban">
                <div class="ban-choose" id="Ban1"></div>
                <div class="ban-choose" id="Ban1"></div>
                <div class="ban-choose" id="Ban1"></div>
                <div class="ban-choose" id="Ban1"></div>
            </div>
            <div class="ban">
                <div class="ban-choose" id="Ban2"></div>
                <div class="ban-choose" id="Ban2"></div>
                <div class="ban-choose" id="Ban2"></div>
                <div class="ban-choose" id="Ban2"></div>
            </div>
            <div id="team2-container">
            <div class="hero-choose" id="AbyssalDragon2"><img src="/assest/etc/AbyssalDragon.webp" data-default="/assest/etc/AbyssalDragon.webp"></div>
            <div class="hero-choose" id="Support2"><img src="/assest/etc/Support.webp" data-default="/assest/etc/Support.webp"></div>
            <div class="hero-choose" id="Mid2"><img src="/assest/etc/Mid.webp" data-default="/assest/etc/Mid.webp"></div>
            <div class="hero-choose" id="Jungle2"><img src="/assest/etc/Jungle.webp" data-default="/assest/etc/Jungle.webp"></div>
            <div class="hero-choose" id="DarkSlayer2"><img src="/assest/etc/DarkSlayer.webp" data-default="/assest/etc/DarkSlayer.webp"></div>
            </div>
        </div>
        <div class="content" id="content-${index}">
            <div class="display ">
                <p id="ban-list-1-${index}" class="ban-list">Team 1 Ban: </p>
                <p id="ban-list-2-${index}" class="ban-list">Team 2 Ban: </p>
                <p id="cc-display-${index}" class="ban-list"></p>
                <p id="dmgtype-display-${index}" class="ban-list"></p>
                <p id="damage-display-${index}" class="ban-list"></p>
                <p id="dura-display-${index}" class="ban-list"></p>
            </div>
        <div class="hero-select">
            <div id="lane-filter" style="margin-bottom: 10px;">
                <button data-lane="ทั้งหมด">ทั้งหมด</button>
                <button data-lane="Abyssal">แครี่</button>
                <button data-lane="Support">ซัพ</button>
                <button data-lane="Mid">เมจ</button>
                <button data-lane="Jungle">ป่า</button>
                <button data-lane="DarkSlayer">ออฟ</button>
                <button data-type="Early">ต้น</button>
                <button data-type="Late">เลท</button>
                <button data-type="burst">เบิร์ส</button>
                <button data-type="cc">CC</button>
                <button data-type="heal">Heal</button>
                <button data-type="dulability">อึด</button>
                <button data-type="waveclear">WaveClear</button>
                <button data-type="hardlock">จับตาย</button>
                <button data-type="sight">เปิดแมพ</button>
                <button data-type="push">ผลัก</button>
                <button data-type="hook">รวบ</button>
                <button data-type="CCresist">ต้านCC</button>
                <button data-type="tierS">S</button>
                <button data-type="tierA">A</button>
            </div>
            <div id="hero-gallery" style="display: flex; flex-wrap: wrap; gap: 10px;"></div>
        </div>
  `;
    if (index !== currentGameIndex) gameWrapper.style.display = 'none';
    gameContainer.appendChild(gameWrapper);
    bindEventsToGame(index);
}
function bindEventsToGame(index) {
    const gameWrapper = document.querySelector(`.game[data-index="${index}"]`);
    const gallery = gameWrapper.querySelector("#hero-gallery");
    const chooseBoxes = gameWrapper.querySelectorAll(".hero-choose");
    const banBoxes = document.querySelectorAll(`#ban-pick-${index} .ban-choose`);
    const filterButtons = gameWrapper.querySelectorAll('#lane-filter button');
  // hero-choose
    chooseBoxes.forEach(box => {
        const originalImg = box.querySelector("img");
        box.addEventListener("click", () => {
            const imgInBox = box.querySelector("img");
            if (imgInBox && imgInBox.alt) {
                const heroName = imgInBox.alt;
                const galleryImg = Array.from(gallery.querySelectorAll("img")).find(img => img.alt === heroName);
                if (galleryImg) {
                galleryImg.style.display = "inline-block";
                galleryImg.classList.remove("hero-red", "hero-blue", "hero-gray");
                }
                imgInBox.src = originalImg.dataset.default;
                imgInBox.alt = "";
            } else if (selectedHero && selectedElement) {
                imgInBox.src = `./assest/hero/${selectedHero}.webp`;
                imgInBox.alt = selectedHero;
                selectedElement.style.display = "none";
                selectedElement.style.outline = "none";
                selectedHero = null;
                selectedElement = null;
            }
                updateTeam();
        });
});
// ban-choose
banBoxes.forEach(box => {
    box.addEventListener("click", () => {
        const imgInBox = box.querySelector("img");
        if (imgInBox) {
            const heroName = imgInBox.alt;
            const galleryImg = Array.from(gallery.children).find(img => img.alt === heroName);
            if (galleryImg) galleryImg.style.display = "inline-block";
            box.innerHTML = "";
            updateBanList(); 
        } else if (selectedHero && selectedElement) {
            const newImg = selectedElement.cloneNode(true);
            newImg.style.width = "100%";
            newImg.style.height = "100%";
            newImg.style.outline = "none";
            box.innerHTML = "";
            box.appendChild(newImg);
            selectedElement.style.display = "none";
            selectedElement.style.outline = "none";
            selectedHero = null;
            selectedElement = null;
            updateBanList();
        }
    });
});
// filter
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lane = button.dataset.lane;
        const type = button.dataset.type;
        if (lane === "ทั้งหมด") {
            selectedLanes.clear();
            selectedTypes.clear();
            filterButtons.forEach(btn => btn.classList.remove("active"));
            initGallery(heroDataList, gallery);
            return;
        }
        const isActive = button.classList.toggle("active");
        if (lane) {
            isActive ? selectedLanes.add(lane) : selectedLanes.delete(lane);
        }
        if (type) {
            isActive ? selectedTypes.add(type) : selectedTypes.delete(type);
        }
        let filtered = heroDataList.filter(h => {
            const matchLane = selectedLanes.size === 0 || [...selectedLanes].every(l =>
            h.Lane && h.Lane.toLowerCase().includes(l.toLowerCase())
        );
        const matchType = selectedTypes.size === 0 || [...selectedTypes].some(t => {
            switch (t) {
                case 'Early': return h.time_raw && (h.time_raw.includes("early"));
                case 'Late': return h.time_raw && h.time_raw.includes("late");
                case 'burst': return h.Ability && h.Ability.toLowerCase().includes("burst");
                case 'cc': return Number(h.CC) >= 2;
                case 'heal': return h.Ability && h.Ability.toLowerCase().includes("heal");
                case 'speed': return Number(h.Mobility) >= 2 && h.Ability && h.Ability.toLowerCase().includes("speed");
                case 'mobility': return Number(h.Mobility) >= 2 && h.Ability && h.Ability.toLowerCase().includes("dash");
                case 'dulability': return Number(h.Dulability) >= 2;
                case 'waveclear': return h.Ability && h.Ability.toLowerCase().includes("wave");
                case 'hardlock': return h.Ability && h.Ability.toLowerCase().includes("hardlock");
                case 'sight': return h.Ability && h.Ability.toLowerCase().includes("sight");
                case 'push': return h.Ability && h.Ability.toLowerCase().includes("push");
                case 'hook': return h.Ability && h.Ability.toLowerCase().includes("hook");
                case 'CCresist': return h.Ability && h.Ability.toLowerCase().includes("ccresist");
                case 'tierS': return h.Tier && h.Tier.toUpperCase().includes("S");
                case 'tierA': return h.Tier && h.Tier.toUpperCase().includes("A");
                default: return true;
            }
        });
        return matchLane && matchType;
    });  
        initGallery(filtered, gallery);
    });
  });
}
function switchGame(index) {
    document.querySelectorAll('.tab').forEach((tab, i) => {
        tab.style.backgroundColor = i === index ? '#fff' : '#bcd';
    });
    document.querySelectorAll('.game').forEach(game => {
        game.style.display = game.dataset.index == index ? 'block' : 'none';
    });
    currentGameIndex = index;
    updateTeam();
}
tabAdd.addEventListener('click', () => {
    console.log("Hero Team 1:", heroteam1);
    console.log("Hero Team 2:", heroteam2);
    if (gameData.length >= MAX_GAMES) return;
    const index = gameData.length;
    gameData.push({ team1: [], team2: [], ban1: [], ban2: [] });
    createGameTab(index);
    createGameContent(index);
    const newGallery = document.querySelector(`#content-${index} #hero-gallery`);
    if (newGallery) {
        initGallery(heroDataList, newGallery);
    }
    switchGame(index);
    if (gameData.length >= MAX_GAMES) {
        tabAdd.style.display = "none";
    }
});
let selectedHero = null;
let selectedElement = null;
const heroDataList = [];
fetch('./ROV.csv')
    .then(response => response.text())
    .then(csvText => {
        const lines = csvText.trim().split('\n');
        const header = lines[0].split(',').map(h => h.trim());
        const noteIndex = header.indexOf("หมายเหตุ");
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim());
            if (!cols[0]) continue;
            const heroObj = {};
            header.forEach((key, index) => {
            if (key !== "หมายเหตุ") {
                heroObj[key] = cols[index] || "";
            }
            });
            let timeRaw = "";
            header.forEach((key, index) => {
              const col = cols[index] || "";
              const keyLower = key.toLowerCase();
              if (keyLower === "time") timeRaw = col.toLowerCase(); // ✅ เก็บค่า time_raw อย่างมั่นใจ
              if (key !== "หมายเหตุ") {
                heroObj[key] = col;
              }
            });
            heroObj.time_raw = timeRaw || "";
            if (timeRaw === "all" || timeRaw === "early/mid") {
                heroObj.time = 1;
            } else if (timeRaw === "mid/late") {
                heroObj.time = 2;
            } else if (timeRaw === "late") {
                heroObj.time = 3;
            } else {
                heroObj.time = 1;
            }
            heroDataList.push(heroObj);
        }
        heroDataList.sort((a, b) => a.Hero.localeCompare(b.Hero));
        initGallery(heroDataList);
        updateTeam();
    });
function initGallery(heroList, targetGallery) {
    const gallery = targetGallery || document.querySelector("#hero-gallery");
    gallery.innerHTML = "";
// ตรวจสอบฮีโร่ที่ถูกใช้ในทุกเกมก่อนหน้า
    const allUsedHeroes = {};
    for (let i = 0; i <= currentGameIndex; i++) {
        const game = gameData[i];
        game.team1.forEach(h => allUsedHeroes[h] = allUsedHeroes[h] ? [...allUsedHeroes[h], 'team1'] : ['team1']);
        game.team2.forEach(h => allUsedHeroes[h] = allUsedHeroes[h] ? [...allUsedHeroes[h], 'team2'] : ['team2']);
    }
heroList.forEach(heroObj => {
    const hero = heroObj.Hero;
    const wrapper = document.createElement("div");
    wrapper.className = "hero-wrapper";
    const img = document.createElement("img");
    img.src = `./assest/hero/${hero}.webp`;
    img.alt = hero;
    img.title = hero;
    img.style.width = "80px";
    img.style.height = "80px";
    img.style.border = "1px solid #000";
    img.style.cursor = "pointer";
    if (heroteam1.includes(hero) && heroteam2.includes(hero)) {
        img.style.filter = "grayscale(100%)"; // เทา
    } else if (heroteam1.includes(hero)) {
        img.style.filter = "sepia(100%) hue-rotate(-50deg) saturate(300%) brightness(90%)"; // แดง
    } else if (heroteam2.includes(hero)) {
        img.style.filter = "sepia(100%) hue-rotate(190deg) saturate(300%) brightness(90%)"; // น้ำเงิน
    }
    wrapper.appendChild(img);
    img.addEventListener("click", () => {
        if (selectedElement) selectedElement.style.outline = "none";
        selectedHero = hero;
        selectedElement = img;
        img.style.outline = "3px solid red";
    });
    gallery.appendChild(wrapper);
});
}
const filterButtons = document.querySelectorAll('#lane-filter button');
const selectedLanes = new Set();
const selectedTypes = new Set();
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
    const lane = button.dataset.lane;
    const type = button.dataset.type;
    // ถ้ากด "ทั้งหมด" -> ล้างทุกอย่าง
    if (lane === "ทั้งหมด") {
      selectedLanes.clear();
      selectedTypes.clear();
      filterButtons.forEach(btn => btn.classList.remove("active"));
      initGallery(heroDataList);
      return;
    }
    // toggle active class
    const isActive = button.classList.toggle("active");
    if (lane) {
        isActive ? selectedLanes.add(lane) : selectedLanes.delete(lane);
    }
    if (type) {
        isActive ? selectedTypes.add(type) : selectedTypes.delete(type);
    }
    // กรองตาม filter ที่เลือก
    let filtered = heroDataList.filter(h => {
      // Lane filter
        const matchLane = selectedLanes.size === 0 || [...selectedLanes].every(l =>
        h.Lane && h.Lane.toLowerCase().includes(l.toLowerCase())
      );
        // Type filter
        const matchType = selectedTypes.size === 0 || [...selectedTypes].some(t => {
        switch (t) {
            case 'Early': return h.time_raw && (h.time_raw.includes("early"));
            case 'Late': return h.time_raw && h.time_raw.includes("late");
            case 'burst': return h.Ability && h.Ability.toLowerCase().includes("burst");
            case 'cc': return Number(h.CC) >= 2;
            case 'heal': return h.Ability && h.Ability.toLowerCase().includes("heal");
            case 'dulability': return Number(h.Dulability) >= 2;
            case 'waveclear': return h.Ability && h.Ability.toLowerCase().includes("wave");
            case 'hardlock': return h.Ability && h.Ability.toLowerCase().includes("hardlock");
            case 'sight': return h.Ability && h.Ability.toLowerCase().includes("sight");
            case 'push': return h.Ability && h.Ability.toLowerCase().includes("push");
            case 'hook': return h.Ability && h.Ability.toLowerCase().includes("hook");
            case 'CCresist': return h.Ability && h.Ability.toLowerCase().includes("ccresist");
            case 'tierS': return h.Tier && h.Tier.toUpperCase().includes("S");
            case 'tierA': return h.Tier && h.Tier.toUpperCase().includes("A");
            default: return true;
        }
        });
        return matchLane && matchType;
    });
    initGallery(filtered);
  });
});
const chooseBoxes = document.querySelectorAll(".hero-choose, .ban-choose");
chooseBoxes.forEach(box => {
  const originalImg = box.querySelector("img");
  box.addEventListener("click", () => {
    const imgInBox = box.querySelector("img");
    // คืนฮีโร่เก่ากลับ gallery
    if (imgInBox && imgInBox.alt) {
      const heroName = imgInBox.alt;
      imgInBox.src = originalImg.dataset.default;
      imgInBox.alt = "";
        updateTeam(); 
        initGallery(heroDataList);
    }
    // ใส่ฮีโร่ใหม่
    else if (selectedHero && selectedElement) {
      imgInBox.src = `./assest/hero/${selectedHero}.webp`;
      imgInBox.alt = selectedHero;
        selectedElement.classList.add("picked");
        selectedElement.style.outline = "none";
        selectedHero = null;
        selectedElement = null;
    }
  });
});
function updateBanList() {
  const currentGameWrapper = document.querySelector(`.game[data-index="${currentGameIndex}"]`);
  const banBoxes1 = currentGameWrapper.querySelectorAll(`.ban:nth-child(2) .ban-choose`);
  const banBoxes2 = currentGameWrapper.querySelectorAll(`.ban:nth-child(3) .ban-choose`);
  const ban1 = [];
  const ban2 = [];
  banBoxes1.forEach(box => {
    const img = box.querySelector("img");
    if (img?.alt) ban1.push(img.alt);
  });
  banBoxes2.forEach(box => {
    const img = box.querySelector("img");
    if (img?.alt) ban2.push(img.alt);
  });
  const banList1 = currentGameWrapper.querySelector(`#ban-list-1-${currentGameIndex}`);
  const banList2 = currentGameWrapper.querySelector(`#ban-list-2-${currentGameIndex}`);
  if (banList1) banList1.textContent = "Team 1 Ban: " + ban1.join(" , ");
  if (banList2) banList2.textContent = "Team 2 Ban: " + ban2.join(" , ");
}
let heroteam1 = [];
let heroteam2 = [];
function updateTeam() {
  const currentGameWrapper = document.querySelector(`.game[data-index="${currentGameIndex}"]`);
  const team1Boxes = currentGameWrapper.querySelectorAll("#team1-container .hero-choose img");
  const team2Boxes = currentGameWrapper.querySelectorAll("#team2-container .hero-choose img");
    const newTeam1 = Array.from(team1Boxes).map(img => img.alt).filter(alt => alt);
    const newTeam2 = Array.from(team2Boxes).map(img => img.alt).filter(alt => alt);
// เพิ่มแบบไม่ซ้ำ
heroteam1 = [...new Set([...heroteam1, ...newTeam1])];
heroteam2 = [...new Set([...heroteam2, ...newTeam2])];
  let team1CC = 0;
  let team1Damage = 0;
  let team1Dulability = 0;
  let typeCount = {
    "Physical Damage": 0,
    "Magic Damage": 0,
    "True Damage": 0
  };
  let magicCount = 0;
  team1Boxes.forEach(img => {
    const heroName = img.alt;
    const hero = heroDataList.find(h => h.Hero === heroName);
    if (hero) {
      if (hero.CC) team1CC += Number(hero.CC);
      if (hero.Damage) team1Damage += Number(hero.Damage);
      if (hero.Dulability) team1Dulability += Number(hero.Dulability);
      const type = hero["Damage Type"]?.trim().toLowerCase();
      if (type === "magic damage") {
        typeCount["Magic Damage"]++;
        magicCount++;
      } else if (type === "physical damage") {
        typeCount["Physical Damage"]++;
      } else if (type === "true damage") {
        typeCount["True Damage"]++;
      }
    }
  });
  let maxType = "N/A";
  let maxCount = 0;
  let maxTypes = [];
  for (let type in typeCount) {
    if (typeCount[type] > maxCount) {
      maxCount = typeCount[type];
      maxTypes = [type];
    } else if (typeCount[type] === maxCount && maxCount > 0) {
      maxTypes.push(type);
    }
  }
  if (maxTypes.length === 1) {
    maxType = maxTypes[0];
  } else if (maxTypes.length > 1) {
    maxType = "ผสม";
  }
  const ccDisplay = currentGameWrapper.querySelector(`#cc-display-${currentGameIndex}`);
  const dmgTypeDisplay = currentGameWrapper.querySelector(`#dmgtype-display-${currentGameIndex}`);
  const dmgDisplay = currentGameWrapper.querySelector(`#damage-display-${currentGameIndex}`);
  const duraDisplay = currentGameWrapper.querySelector(`#dura-display-${currentGameIndex}`);
  if (ccDisplay) {
    let ccText = `Team 1 CC: ${team1CC}`;
    if (team1CC < 7) ccText += ` <span class="cc-warning">(CC น้อยเกินไป)</span>`;
    ccDisplay.innerHTML = ccText;
  }
  if (dmgTypeDisplay) {
    let dmgTypeText = `Team 1 Damage Type: <strong>${maxType}</strong>`;
    if (magicCount === 0) {
      dmgTypeText += ` <span class="cc-warning">(ต้องการดาเมจเวท)</span>`;
    } else if (magicCount >= 3) {
      dmgTypeText += ` <span class="cc-warning">(ดาเมจเวทมากเกินไป)</span>`;
    }
    dmgTypeDisplay.innerHTML = dmgTypeText;
  }
  if (dmgDisplay) {
    let dmgText = `Team 1 Damage: ${team1Damage}`;
    if (team1Damage < 15) dmgText += ` <span class="cc-warning">(ดาเมจน้อยเกินไป)</span>`;
    dmgDisplay.innerHTML = dmgText;
  }
  if (duraDisplay) {
    let duraText = `Team 1 Dulability: ${team1Dulability}`;
    if (team1Dulability < 7) duraText += ` <span class="cc-warning">(ตัวรับดาเมจน้อยเกินไป)</span>`;
    duraDisplay.innerHTML = duraText;
  }
  // 🔴 ตรวจสอบการเปิดแมพ
  const displayContainer = currentGameWrapper.querySelector(".display");
  const oldWarnings = displayContainer.querySelectorAll(".extra-warning");
  oldWarnings.forEach(el => el.remove());
  const team2HasInvisible = Array.from(team2Boxes).some(img => {
    const hero = heroDataList.find(h => h.Hero === img.alt);
    return hero?.Ability?.toLowerCase().includes("invisible");
  });
  const team1HasSight = Array.from(team1Boxes).some(img => {
    const hero = heroDataList.find(h => h.Hero === img.alt);
    return hero?.Ability?.toLowerCase().includes("sight");
  });
  if (team2HasInvisible && !team1HasSight) {
    const warn = document.createElement("p");
    warn.className = "ban-list cc-warning extra-warning";
    warn.textContent = "ต้องการ hero เปิดแมพ";
    displayContainer.appendChild(warn);
  }
  let team1Time = 0;
let team2Time = 0;

team1Boxes.forEach(img => {
  const hero = heroDataList.find(h => h.Hero === img.alt);
  if (hero?.time) team1Time += Number(hero.time);
});
team2Boxes.forEach(img => {
  const hero = heroDataList.find(h => h.Hero === img.alt);
  if (hero?.time) team2Time += Number(hero.time);
});

// 🟢 แสดงผลรวม time
let timeDisplay = currentGameWrapper.querySelector(`#time-display-${currentGameIndex}`);
if (!timeDisplay) {
  timeDisplay = document.createElement("p");
  timeDisplay.id = `time-display-${currentGameIndex}`;
  timeDisplay.className = "ban-list";
  const displaySection = currentGameWrapper.querySelector(".display");
  displaySection.appendChild(timeDisplay);
}

// 🟡 ฟังก์ชันช่วยแปลง time → label
function getTimeLabel(time) {
  if (time < 7) return "ทีมต้นเกม";
  if (time <= 12) return "ทีมกลางเกม";
  return "ทีมเลทเกม";
}

const team1Label = getTimeLabel(team1Time);
const team2Label = getTimeLabel(team2Time);

// 🟢 แสดงรวมทั้งสองทีมในบรรทัดเดียว
timeDisplay.innerHTML = `
  Team 1: ${team1Time} (${team1Label})<br>
  Team 2: ${team2Time} (${team2Label})
`;


}
initGallery(heroDataList); 

});