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
    // อัปเดต selection bar
    setTimeout(updateTabSelectionBar, 0);
}
function createGameContent(index) {
    const gameWrapper = document.createElement('div');
    gameWrapper.className = 'game';
    gameWrapper.dataset.index = index;
    gameWrapper.innerHTML = `
        <div class="ban-pick" id="ban-pick-${index}"> 
            <div class="team-section">
            <div class="team-label1">Team 1</div>
            <div id="team1-container">
            <div class="hero-choose" id="AbyssalDragon1"><img src="/asset/etc/AbyssalDragon.webp" data-default="/asset/etc/AbyssalDragon.webp"></div>
            <div class="hero-choose" id="Support1"><img src="/asset/etc/Support.webp" data-default="/asset/etc/Support.webp"></div>
            <div class="hero-choose" id="Mid1">  <img src="/asset/etc/Mid.webp" data-default="/asset/etc/Mid.webp"></div>
            <div class="hero-choose" id="Jungle1"><img src="/asset/etc/Jungle.webp" data-default="/asset/etc/Jungle.webp"></div>
            <div class="hero-choose" id="DarkSlayer1"><img src="/asset/etc/DarkSlayer.webp" data-default="/asset/etc/DarkSlayer.webp"></div>
            </div>
            </div>
            <div class="ban1">
                <div class="ban-choose" id="Ban1"></div>
                <div class="ban-choose" id="Ban1"></div>
                <div class="ban-choose" id="Ban1"></div>
                <div class="ban-choose" id="Ban1"></div>
            </div>
            <div class="team-section">
            <div class="team-label2">Team 2</div>
            <div id="team2-container">
            <div class="hero-choose" id="AbyssalDragon2"><img src="/asset/etc/AbyssalDragon.webp" data-default="/asset/etc/AbyssalDragon.webp"></div>
            <div class="hero-choose" id="Support2"><img src="/asset/etc/Support.webp" data-default="/asset/etc/Support.webp"></div>
            <div class="hero-choose" id="Mid2"><img src="/asset/etc/Mid.webp" data-default="/asset/etc/Mid.webp"></div>
            <div class="hero-choose" id="Jungle2"><img src="/asset/etc/Jungle.webp" data-default="/asset/etc/Jungle.webp"></div>
            <div class="hero-choose" id="DarkSlayer2"><img src="/asset/etc/DarkSlayer.webp" data-default="/asset/etc/DarkSlayer.webp"></div>
            </div>
            </div>
            <div class="ban2">
                <div class="ban-choose" id="Ban2"></div>
                <div class="ban-choose" id="Ban2"></div>
                <div class="ban-choose" id="Ban2"></div>
                <div class="ban-choose" id="Ban2"></div>
            </div>
        </div>
        <div class="content" id="content-${index}">
            <div class="display ">
              
            </div>
        <div class="hero-select">
            <div id="lane-filter" style="margin-bottom: 10px;">
                <button data-lane="Abyssal">Abyssal</button>
                <button data-lane="Support">Support</button>
                <button data-lane="Mid">Mid</button>
                <button data-lane="Jungle">Jungle</button>
                <button data-lane="DarkSlayer">Dark</button>
                <button data-type="Early">ต้น</button>
                <button data-type="Late">เลท</button>
                <button data-type="burst">เบิร์ส</button>
                <button data-type="cc">CC</button>
                <button data-type="dulability">อึด</button>
                <button data-type="waveclear">Wave</button>
                <button data-type="hardlock">จับตาย</button>
                <button data-type="sight">เปิดแมพ</button>
                <button data-type="push">ผลัก</button>
                <button data-type="hook">เกี่ยว</button>
                <button data-type="tierS">S</button>
                <button data-type="tierA">A</button>
            </div>
            <input type="text" id="hero-search-${index}" placeholder="ค้นหาชื่อฮีโร่..." style="margin-bottom:10px;width:100%;max-width:300px;">
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
    const banBoxes1 = gameWrapper.querySelectorAll(`.ban1 .ban-choose`);
    const banBoxes2 = gameWrapper.querySelectorAll(`.ban2 .ban-choose`);
    const filterButtons = gameWrapper.querySelectorAll('#lane-filter button');
    const searchInput = gameWrapper.querySelector(`#hero-search-${index}`);
    const selectedLanes = new Set();
    const selectedTypes = new Set();
    let searchText = "";

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
                imgInBox.src = `./asset/hero/${selectedHero}.webp`;
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
[...banBoxes1, ...banBoxes2].forEach(box => {
    box.addEventListener("click", () => {
        const imgInBox = box.querySelector("img");
        if (imgInBox) {
            const heroName = imgInBox.alt;
            const galleryImg = Array.from(gallery.querySelectorAll("img")).find(img => img.alt === heroName);
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
    function filterAndShow() {
        let filtered = heroDataList.filter(h => {
            const matchLane = selectedLanes.size === 0 || [...selectedLanes].every(l =>
                h.Lane && h.Lane.toLowerCase().includes(l.toLowerCase())
            );
            const matchType = selectedTypes.size === 0 || [...selectedTypes].every(t => {
                switch (t) {
                    case 'Early': return h.time_raw && (h.time_raw.includes("early"));
                    case 'Late': return h.time_raw && h.time_raw.includes("late");
                    case 'burst': return h.Ability && h.Ability.toLowerCase().includes("burst");
                    case 'cc': return Number(h.CC) >= 2;
                    case 'mobility': return Number(h.Mobility) >= 2 && h.Ability && h.Ability.toLowerCase().includes("dash");
                    case 'dulability': return Number(h.Dulability) >= 2;
                    case 'waveclear': return h.Ability && h.Ability.toLowerCase().includes("wave");
                    case 'hardlock': return h.Ability && h.Ability.toLowerCase().includes("hardlock");
                    case 'sight': return h.Ability && h.Ability.toLowerCase().includes("sight");
                    case 'push': return h.Ability && h.Ability.toLowerCase().includes("push");
                    case 'hook': return h.Ability && h.Ability.toLowerCase().includes("hook");
                    case 'tierS': return h.Tier && h.Tier.toUpperCase().includes("S");
                    case 'tierA': return h.Tier && h.Tier.toUpperCase().includes("A");
                    default: return true;
                }
            });
            const matchSearch = !searchText || (h.Hero && h.Hero.toLowerCase().includes(searchText.toLowerCase()));
            return matchLane && matchType && matchSearch;
        });
        initGallery(filtered, gallery, true);
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lane = button.dataset.lane;
            const type = button.dataset.type;
            const isActive = button.classList.toggle("active");
            if (lane) {
                isActive ? selectedLanes.add(lane) : selectedLanes.delete(lane);
            }
            if (type) {
                isActive ? selectedTypes.add(type) : selectedTypes.delete(type);
            }
            filterAndShow();
        });
    });

    // เพิ่ม event สำหรับ input ค้นหา
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchText = e.target.value;
            filterAndShow();
        });
    }
}
function updateTabSelectionBar() {
    const tabBar = document.querySelector('.tab-bar');
    const tabs = tabBar.querySelectorAll('.tab');
    const selection = tabBar.querySelector('.selection');
    const activeTab = tabBar.querySelector('.tab.active') || tabs[0];
    if (!activeTab || !selection) return;
    selection.style.width = `${activeTab.offsetWidth}px`;
    selection.style.left = `${activeTab.offsetLeft}px`;
}
function switchGame(index) {
    document.querySelectorAll('.tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
        tab.style.backgroundColor = i === index ? '#fff' : '#bcd';
    });
    document.querySelectorAll('.game').forEach(game => {
        game.style.display = game.dataset.index == index ? 'block' : 'none';
    });
    currentGameIndex = index;
    updateTeam();
    updateTabSelectionBar();
}
tabAdd.addEventListener('click', () => {
    if (gameData.length >= MAX_GAMES) return;
    const index = gameData.length;
    if (index === 6) { 
        team1choose = [];
        team2choose = [];
    }
    gameData.push({ team1: [], team2: [], ban1: [], ban2: [] });
    createGameTab(index);
    createGameContent(index);
    const newGallery = document.querySelector(`#content-${index} #hero-gallery`);
    if (newGallery) {
        initGallery(heroDataList, newGallery,false);
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
        const weakness = header.indexOf("Weakness");
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim());
            if (!cols[0]) continue;
            const heroObj = {};
            header.forEach((key, index) => {
            if (key !== "หมายเหตุ") {
                heroObj[key] = cols[index] || "";
            }
            });
            heroObj.weakness = cols[weakness] || "";
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
function initGallery(heroList, targetGallery, none = true) {
    const gallery = targetGallery || document.querySelector("#hero-gallery");
    if (!gallery) return; // <--- เพิ่มบรรทัดนี้
    gallery.innerHTML = "";

    const currentGameWrapper = document.querySelector(`.game[data-index="${currentGameIndex}"]`);
    const team1Boxes = currentGameWrapper.querySelectorAll("#team1-container .hero-choose img");
    const team2Boxes = currentGameWrapper.querySelectorAll("#team2-container .hero-choose img");
    const ban1Boxes = currentGameWrapper.querySelectorAll(".ban1 .ban-choose img");
    const ban2Boxes = currentGameWrapper.querySelectorAll(".ban2 .ban-choose img");

    // newTeam1/newTeam2 = ทีมที่เลือกในรอบนี้
    const newTeam1 = Array.from(team1Boxes).map(img => img.alt).filter(Boolean);
    const newTeam2 = Array.from(team2Boxes).map(img => img.alt).filter(Boolean);
    const ban1 = Array.from(ban1Boxes).map(img => img.alt).filter(Boolean);
    const ban2 = Array.from(ban2Boxes).map(img => img.alt).filter(Boolean);

    // รวมทั้งหมดที่ต้องซ่อน
    const chosenHeroes = [...newTeam1, ...newTeam2, ...ban1, ...ban2];

    heroList.forEach(heroObj => {
        const hero = heroObj.Hero;
        const wrapper = document.createElement("div");
        wrapper.className = "hero-wrapper";
        const img = document.createElement("img");
        img.src = `./asset/hero/${hero}.webp`;
        img.alt = hero;
        img.title = hero;
        img.style.width = "80px";
        img.style.height = "80px";
        img.style.border = "1px solid #000";
        img.style.cursor = "pointer";

      if (none) {
        if (chosenHeroes.includes(hero)) {
            img.style.display = "none";
        }}
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
function updateBanList() {
  const currentGameWrapper = document.querySelector(`.game[data-index="${currentGameIndex}"]`);
  const banBoxes1 = currentGameWrapper.querySelectorAll(`.ban1:nth-child(2) .ban-choose`);
  const banBoxes2 = currentGameWrapper.querySelectorAll(`.ban2:nth-child(3) .ban-choose`);
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
}
let lastFilteredHero = null;
let win1 = 0;
let win2 = 0;
function winner() {
  win1++;
}
function loser() {
  win2++;
}
function updateTeam() {
  const currentGameWrapper = document.querySelector(`.game[data-index="${currentGameIndex}"]`);
  const team1Boxes = currentGameWrapper.querySelectorAll("#team1-container .hero-choose img");
  const team2Boxes = currentGameWrapper.querySelectorAll("#team2-container .hero-choose img");
  const newTeam1 = Array.from(team1Boxes).map(img => img.alt).filter(alt => alt);
  const newTeam2 = Array.from(team2Boxes).map(img => img.alt).filter(alt => alt);

  if (lastFilteredHero) {
  const gallery = currentGameWrapper.querySelector("#hero-gallery");
  initGallery(heroDataList, gallery, true);
  lastFilteredHero = null;
}

  // ✅ เตรียม display ฝั่งซ้าย/ขวา
  const displayContainer = currentGameWrapper.querySelector(".display");
  // ✅ ฟังก์ชันช่วยสร้าง/อัปเดต <p>
  function setStat(displayEl, id, text) {
    let p = displayEl.querySelector(`#${id}-${currentGameIndex}`);
    if (!p) {
      p = document.createElement("p");
      p.id = `${id}-${currentGameIndex}`;
      displayEl.appendChild(p);
    }
    p.innerHTML = text;
  }

  // ✅ คำนวณค่าทีม 1
  let team1CC = 0, team1Damage = 0, team1Dulability = 0, team1Time = 0;
  let typeCount = { "กายภาพ": 0, "เวท": 0, "จริง": 0 };
  let magicCount = 0;
  team1Boxes.forEach(img => {
    const hero = heroDataList.find(h => h.Hero === img.alt);
    if (hero) {
      team1CC += Number(hero.CC || 0);
      team1Damage += Number(hero.Damage || 0);
      team1Dulability += Number(hero.Dulability || 0);
      team1Time += Number(hero.time || 0);
      const type = hero["Damage Type"]?.trim().toLowerCase();
      if (type === "magic damage") {
        typeCount["เวท"]++;
        magicCount++; // <-- นับเฉพาะ team1
      } else if (type === "physical damage") {
        typeCount["กายภาพ"]++;
      } else if (type === "true damage") {
        typeCount["จริง"]++;
      }
    }
  });

  let maxType = "N/A", maxCount = 0, maxTypes = [];
  for (let type in typeCount) {
    if (typeCount[type] > maxCount) {
      maxCount = typeCount[type];
      maxTypes = [type];
    } else if (typeCount[type] === maxCount && maxCount > 0) {
      maxTypes.push(type);
    }
  }
  if (maxTypes.length === 1) maxType = maxTypes[0];
  else if (maxTypes.length > 1) maxType = "ผสม";

  // ✅ คำนวณค่าทีม 2
  let team2CC = 0, team2Damage = 0, team2Dulability = 0, team2Time = 0;
  let typeCount2 = { "กายภาพ": 0, "เวท": 0, "จริง": 0 };
  team2Boxes.forEach(img => {
    const hero = heroDataList.find(h => h.Hero === img.alt);
    if (hero) {
      team2CC += Number(hero.CC || 0);
      team2Damage += Number(hero.Damage || 0);
      team2Dulability += Number(hero.Dulability || 0);
      team2Time += Number(hero.time || 0);
      const type = hero["Damage Type"]?.trim().toLowerCase();
      if (type === "magic damage") {
        typeCount2["เวท"]++;
        // magicCount++;  // **ลบบรรทัดนี้ออก**
      } else if (type === "physical damage") {
        typeCount2["กายภาพ"]++;
      } else if (type === "true damage") {
        typeCount2["จริง"]++;
      }
    }
  });

let team2MaxType = "N/A", team2MaxCount = 0, team2MaxTypes = [];
for (let type in typeCount2) {
  if (typeCount2[type] > team2MaxCount) {
    team2MaxCount = typeCount2[type];
    team2MaxTypes = [type];
  } else if (typeCount2[type] === team2MaxCount && team2MaxCount > 0) {
    team2MaxTypes.push(type);
  }
}
if (team2MaxTypes.length === 1) team2MaxType = team2MaxTypes[0];
else if (team2MaxTypes.length > 1) team2MaxType = "ผสม";

const warnings = [];

if (magicCount >= 3) warnings.push("ดาเมจเวทมากเกินไป");

displayContainer.innerHTML = "";
setStatRow(displayContainer, `Team 1`,`Team 2`)
setStatRow(displayContainer, `Win: ${win1}`, `Win: ${win2}`);
setStatRow(displayContainer, `CC: ${getCCLabel(team1CC)}`, `CC: ${getCCLabel(team2CC)}`);
setStatRow(displayContainer, `ดาเมจรวม: ${getDmgLabel(team1Damage)}`, `ดาเมจรวม: ${getDmgLabel(team2Damage)}`);
setStatRow(displayContainer, `ความอึด: ${getDefLabel(team1Dulability)}`, `ความอึด: ${getDefLabel(team2Dulability)}`);
setStatRow(displayContainer, `ประเภทดาเมจ: ${maxType}`, `ประเภทดาเมจ: ${team2MaxType}`);
setStatRow(displayContainer, `เกมช่วง: ${getTimeLabel(team1Time)}`, `เกมช่วง: ${getTimeLabel(team2Time)}`);
setStatRow(
  displayContainer,
  // ฝั่ง team 1 แสดงเป็นรูปเหมือนเดิม
  `${newTeam1.map(hero => `<img src="./asset/hero/${hero}.webp" alt="${hero}" title="${hero}" style="width:32px;height:32px;vertical-align:middle;margin-right:4px;border:1px solid #888;border-radius:4px;cursor:pointer;" class="team1-hero-img">`).join("")}`,
  // ฝั่ง team 2 แสดงเป็นรูปและเพิ่ม event คลิก
  `${newTeam2.map(hero => `<img src="./asset/hero/${hero}.webp" alt="${hero}" title="${hero}" style="width:32px;height:32px;vertical-align:middle;margin-right:4px;border:1px solid #888;border-radius:4px;cursor:pointer;" class="team2-hero-img">`).join("")}`
);

// หลังจาก setStatRow แล้ว ให้เพิ่ม event ให้กับรูป team2
setTimeout(() => {
  const displayContainer = document.querySelector(`.game[data-index="${currentGameIndex}"] .display`);
  const gallery = document.querySelector(`.game[data-index="${currentGameIndex}"] #hero-gallery`);
  const imgs = displayContainer.querySelectorAll('.team1-hero-img, .team2-hero-img');

  imgs.forEach(img => {
    img.addEventListener('click', () => {
      const heroName = img.alt;
      // toggle filter: ถ้ากดซ้ำที่ตัวเดิม ให้ยกเลิก filter
      if (lastFilteredHero === heroName) {
        initGallery(heroDataList, gallery, true);
        lastFilteredHero = null;
        return;
      }
      lastFilteredHero = heroName;

      // หา heroObj ใน heroDataList (ถ้าไม่มีจะเป็น Soul_Scroll/Sight)
      const heroObj = heroDataList.find(h => h.Hero === heroName);
      let weaknessList = [];
      if (heroObj && heroObj.Weakness) {
        weaknessList = heroObj.Weakness.split(/[,/ ]/).map(s => s.trim()).filter(Boolean);
      }
      // เพิ่ม Soul_Scroll และ Sight ถ้ามีใน weaknessList
      const result = [];
      if (weaknessList.includes("Soul_Scroll")) {
        result.push({ Hero: "Soul_Scroll" });
      }
      if (weaknessList.includes("Sight")) {
        result.push({ Hero: "Sight" });
      }
      // filter hero ที่มีใน weaknessList (ยกเว้น Soul_Scroll/Sight)
      let filtered = heroDataList.filter(h => weaknessList.includes(h.Hero));
      // เรียง a-z
      filtered.sort((a, b) => a.Hero.localeCompare(b.Hero));
      // รวม Soul_Scroll, Sight ไว้ข้างหน้า
      const finalResult = [...result, ...filtered];
      // ถ้าไม่มี result ให้โชว์ว่าง
      initGallery(finalResult.length ? finalResult : [], gallery, true);
    });
  });
}, 0);

// ❗️ต้องมาก่อนคำเตือนพิเศษ
if (warnings.length > 0) {
  const warningContainer = document.createElement("div");
  warningContainer.className = "warning-container";
  warnings.forEach(text => {
    const p = document.createElement("p");
    p.className = "ban-list cc-warning";
    p.textContent = text;
    warningContainer.appendChild(p);
  });
  displayContainer.appendChild(warningContainer);
}

// ✅ ตรวจสอบเปิดแมพ (มาแสดงใหม่แน่ ๆ)
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
  warn.className = "ban-list cc-warning";
  warn.textContent = "ต้องการ hero เปิดแมพ";
  displayContainer.appendChild(warn);
}
  function getDefLabel(def){
    if (def === 0) return " ";
    if (def < 7) return "บาง";
    if (def < 12) return "ปานกลาง";
    return "ถึก"; 
  }
  function getDmgLabel(dmg){
    if (dmg === 0) return " ";
    if (dmg < 12) return "น้อย";
    if (dmg <= 15) return "ปานกลาง";
    if (dmg <= 21) return "เยอะ";
    return "ล้น";
  }
  // เช็ค CC
  function getCCLabel(CC){
    if (CC === 0) return " ";
    if (CC < 5) return "น้อย";
    if (CC <= 9) return "ปานกลาง";
    return "เยอะ";
  }
  // เช็คความเลทฮีโร่
  function getTimeLabel(time) {
    if (time === 0) return " ";
    if (time < 7) return "ทีมต้นเกม";
    if (time <= 12) return "ทีมกลางเกม";
    return "ทีมเลทเกม";
  }
}
function setStatRow(displayEl, team1Text, team2Text) {
  const row = document.createElement("div");
  row.className = "stat-row";

  const p1 = document.createElement("p");
  p1.className = "ban-list";
  if (team1Text.includes("<img")) {
    p1.innerHTML = team1Text;
  } else {
    p1.textContent = team1Text;
  }

  const p2 = document.createElement("p");
  p2.className = "ban-list";
  if (team2Text.includes("<img")) {
    p2.innerHTML = team2Text;
  } else {
    p2.textContent = team2Text;
  }

  row.appendChild(p1);
  row.appendChild(p2);
  displayEl.appendChild(row);
}
// ===== เพิ่มปุ่ม Win/Lose ไปขวาสุดของ tab-bar =====
const winLoseContainer = document.createElement('div');
winLoseContainer.style.marginLeft = 'auto';
winLoseContainer.style.display = 'flex';
winLoseContainer.style.gap = '8px';

const winBtn = document.createElement('button');
winBtn.className = 'tab-win';
winBtn.textContent = 'Win';
winBtn.onclick = () => {
    win1++;
    updateTeam();
};
const loseBtn = document.createElement('button');
loseBtn.className = 'tab-lose';
loseBtn.textContent = 'Lose';
loseBtn.onclick = () => {
    win2++;
    updateTeam();
};

winLoseContainer.appendChild(winBtn);
winLoseContainer.appendChild(loseBtn);
tabBar.appendChild(winLoseContainer);

if (!document.querySelector('.tab-bar .selection')) {
    const selection = document.createElement('span');
    selection.className = 'selection';
    document.querySelector('.tab-bar').appendChild(selection);
}

// เรียกครั้งแรกหลัง DOMContentLoaded
setTimeout(updateTabSelectionBar, 0);
initGallery(heroDataList); 
});
