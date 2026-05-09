document.addEventListener("DOMContentLoaded", () => {
    const navLink = document.getElementById("nav-link");
    // 🌟 みつきのGAS URL（ここはこのままでOK！）
    const GAS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw4apfXVC5xixNmMDGvdMQY9t2ST2TuXbSKV0A9baoAPIEnOM8OGY7Zxnp086NJyNpvwA/exec"; 

    // --- 🐛 芋虫 ---
    let wormClicks = 0;
    let wormCrushed = false;
    const worm = document.getElementById("caterpillar");
    const bubble = document.getElementById("caterpillar-speech");
    const wormLines = ["非効率だ。", "僕のTiとSeで斬る。", "システムにバグは？", "触りすぎだ。30回で壊れるぞ。", "無意味な操作だ。"];

    worm.addEventListener("click", () => {
        if (wormCrushed) return;
        wormClicks++;
        if (wormClicks >= 30) {
            wormCrushed = true;
            worm.textContent = "💥";
            worm.classList.add("crushed");
            bubble.textContent = "論理が……崩壊……";
            setTimeout(() => bubble.classList.add("hidden"), 2000);
            return;
        }
        bubble.textContent = wormLines[Math.floor(Math.random() * wormLines.length)];
        bubble.classList.remove("hidden");
        clearTimeout(worm.bubbleTimer);
        worm.bubbleTimer = setTimeout(() => bubble.classList.add("hidden"), 2000);
    });

    // --- 🔴 タイトル長押し (ふわっとアニメーション復活) ---
    let holdTime = 0;
    let startTime = 0;
    const startBtn = document.getElementById("start-btn");
    const inkBg = document.getElementById("ink-bg");
    let holdInterval;

    const startHold = (e) => {
        if(e.cancelable) e.preventDefault();
        startBtn.classList.add("pressed"); // ふわっとへこむ
        holdInterval = setInterval(() => {
            holdTime += 50;
            inkBg.style.width = `${holdTime * 0.6}px`;
            inkBg.style.height = `${holdTime * 0.6}px`;
            inkBg.style.opacity = "1";
        }, 50);
    };

    const endHold = () => {
        clearInterval(holdInterval);
        startBtn.classList.remove("pressed");
        if (holdTime > 300) {
            startTime = Date.now();
            document.getElementById("title-screen").classList.add("hidden");
            document.getElementById("question-screen").classList.remove("hidden");
            inkBg.style.opacity = "0"; 
            navLink.innerHTML = `<i class="fa-solid fa-rotate-left"></i> タイトルに戻る`;
            navLink.href = "javascript:location.reload();";
        } else {
            holdTime = 0;
            inkBg.style.width = "0px";
            inkBg.style.height = "0px";
        }
    };

    startBtn.addEventListener("mousedown", startHold);
    startBtn.addEventListener("mouseup", endHold);
    startBtn.addEventListener("mouseleave", endHold);
    startBtn.addEventListener("touchstart", startHold, {passive: false});
    startBtn.addEventListener("touchend", endHold);

    // --- 🟡 質問UI生成 ---
    const sContainer = document.getElementById("sliders-container");
    const rContainer = document.getElementById("radio-container");
    
    questionsData.forEach(q => {
        const div = document.createElement("div");
        div.className = "input-group";
        if (q.type === "slider") {
            div.innerHTML = `<label>${q.text}</label>
                <div style="display:flex; justify-content:space-between; font-size:11px; color:#888;">
                <span>${q.left}</span><span>${q.right}</span></div>
                <input type="range" id="${q.id}" min="0" max="100" value="50">`;
            sContainer.appendChild(div);
        } else {
            let html = `<label>${q.text}</label><div class="radio-options">`;
            q.options.forEach((opt, i) => {
                html += `<label><input type="radio" name="${q.id}" value="${opt.val}" ${i===0?'checked':''}> ${opt.label}</label>`;
            });
            html += `</div>`;
            div.innerHTML = html;
            rContainer.appendChild(div);
        }
    });

    let selectedMotifs = [];
    const mContainer = document.getElementById("motif-container");
    motifs.forEach(m => {
        const btn = document.createElement("button");
        btn.className = "motif-btn";
        btn.textContent = m.label;
        btn.onclick = () => {
            const idx = selectedMotifs.findIndex(x => x.id === m.id);
            if (idx > -1) {
                selectedMotifs.splice(idx, 1);
            } else if (selectedMotifs.length < 3) {
                selectedMotifs.push(m);
            }
            document.querySelectorAll(".motif-btn").forEach(b => {
                b.classList.remove("selected");
                const mObj = motifs.find(x => x.label === b.textContent);
                if (selectedMotifs.findIndex(x => x.id === mObj.id) > -1) b.classList.add("selected");
            });
        };
        mContainer.appendChild(btn);
    });

    // --- 🟩 心の余白 (Canvas) ---
    const canvas = document.getElementById("margin-canvas");
    const ctx = canvas.getContext("2d");
    let isDrawing = false;
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#a1c4fd";

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const drawStart = (e) => {
        e.preventDefault();
        isDrawing = true;
        const p = getPos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    };

    const drawMove = (e) => {
        if(!isDrawing) return;
        e.preventDefault();
        const p = getPos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    };

    const drawEnd = () => { isDrawing = false; };
    
    canvas.addEventListener("mousedown", drawStart);
    canvas.addEventListener("mousemove", drawMove);
    canvas.addEventListener("mouseup", drawEnd);
    canvas.addEventListener("mouseleave", drawEnd);
    canvas.addEventListener("touchstart", drawStart, {passive:false});
    canvas.addEventListener("touchmove", drawMove, {passive:false});
    canvas.addEventListener("touchend", drawEnd);

    document.getElementById("clear-canvas-btn").onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

    const getFilledRatio = () => {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let filledPixels = 0;
        for (let i = 3; i < data.length; i += 4) { if (data[i] > 0) filledPixels++; }
        return Math.round((filledPixels / (canvas.width * canvas.height)) * 100);
    };

    // --- ✨ ドラッグ軌跡 ---
    const particle = document.getElementById("light-particle");
    const dragArea = document.getElementById("drag-area");
    let isDragging = false;
    let finalPos = { x: 50, y: 50 };

    const moveParticle = (clientX, clientY) => {
        const rect = dragArea.getBoundingClientRect();
        let nx = clientX - rect.left;
        let ny = clientY - rect.top;
        nx = Math.max(0, Math.min(nx, rect.width));
        ny = Math.max(0, Math.min(ny, rect.height));
        particle.style.transform = `translate(${nx - (rect.width/2)}px, ${ny - (rect.height/2)}px)`;
        finalPos = { x: (nx/rect.width)*100, y: (ny/rect.height)*100 };
    };

    particle.addEventListener("mousedown", () => isDragging = true);
    document.addEventListener("mousemove", (e) => { if(isDragging) moveParticle(e.clientX, e.clientY); });
    document.addEventListener("mouseup", () => isDragging = false);
    particle.addEventListener("touchstart", (e) => { isDragging = true; e.preventDefault(); }, {passive: false});
    document.addEventListener("touchmove", (e) => { if(isDragging){ moveParticle(e.touches[0].clientX, e.touches[0].clientY); } }, {passive: false});
    document.addEventListener("touchend", () => isDragging = false);

    // --- 錬成ツール ---
    const hexToRgb = hex => {
        const bigint = parseInt(hex.slice(1), 16);
        return { r: (bigint>>16)&255, g: (bigint>>8)&255, b: bigint&255 };
    };
    const clamp = val => Math.max(0, Math.min(255, Math.round(val)));
    const rgbToHex = (r, g, b) => `#${[r,g,b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
    const hsvToRgb = (h, s, v) => {
        s/=100; v/=100;
        let c=v*s, x=c*(1-Math.abs((h/60)%2-1)), m=v-c;
        let r=0, g=0, b=0;
        if(0<=h&&h<60){r=c;g=x;b=0}else if(60<=h&&h<120){r=x;g=c;b=0}else if(120<=h&&h<180){r=0;g=c;b=x}else if(180<=h&&h<240){r=0;g=x;b=c}else if(240<=h&&h<300){r=x;g=0;b=c}else if(300<=h&&h<360){r=c;g=0;b=x}
        return { r: Math.round((r+m)*255), g: Math.round((g+m)*255), b: Math.round((b+m)*255) };
    };

    // --- 最終錬成処理 ---
    let skippedWait = false;
    document.getElementById("submit-btn").addEventListener("click", () => {
        document.getElementById("question-screen").classList.add("hidden");
        document.getElementById("loading-screen").classList.remove("hidden");
        let loadTimer = setTimeout(() => finalizeColor(), 4000);
        document.getElementById("skip-btn").onclick = () => {
            skippedWait = true;
            clearTimeout(loadTimer);
            finalizeColor();
        };
    });

    const finalizeColor = () => {
        document.getElementById("loading-screen").classList.add("hidden");
        document.getElementById("result-screen").classList.remove("hidden");

        let baseR = 50 + parseInt(document.getElementById("q_energy").value);
        let baseG = 50 + parseInt(document.getElementById("q_chaos").value);
        let baseB = 50 + parseInt(document.getElementById("q_logic").value);

        selectedMotifs.forEach((m, i) => {
            let w = i===0?1.0:(i===1?0.6:0.3);
            baseR+=m.r*w; baseG+=m.g*w; baseB+=m.b*w;
        });

        const text = document.getElementById("mood-text").value.trim();
        let textLog = "標準";
        if (text === "わからない" || text === "不明" || text === "無" || text === "特になし") {
            baseR -= 30; baseG -= 10; baseB += 40;
            textLog = "感情の言語化放棄(Ti優勢) → 青色増幅";
        } else {
            const kanji = (text.match(/[\u4E00-\u9FAF]/g) || []).length;
            const hira = (text.match(/[\u3040-\u309F]/g) || []).length;
            if(kanji > hira) { baseB += 15; textLog = "漢字多用 (客観・無機質)"; }
            else if(hira > kanji) { baseR += 15; textLog = "ひらがな多用 (主観・柔和)"; }
        }

        const filledRatio = getFilledRatio();
        baseR += (255 - baseR) * ((100 - filledRatio) / 100) * 0.5;
        baseG += (255 - baseG) * ((100 - filledRatio) / 100) * 0.5;
        baseB += (255 - baseB) * ((100 - filledRatio) / 100) * 0.5;

        const distFromCenter = Math.hypot(finalPos.x - 50, finalPos.y - 50);
        let posLog = distFromCenter < 20 ? "中央付近(自己安定)" : "端付近(境界・孤立意識)";
        if(distFromCenter > 30) { baseB += 20; }

        const morningVal = document.querySelector(`input[name="q_morning"]:checked`).value;
        if(morningVal === "te") baseB+=20; else if(morningVal === "ne") baseR+=20;
        
        let noise = document.querySelector(`input[name="q_contradiction"]:checked`).value === "conflict" ? 40 : 0;
        if (skippedWait) noise += 50;

        const hour = new Date().getHours();
        let timeLog = "通常";
        if (hour >= 18 || hour < 4) { baseB += 20; baseR -= 10; timeLog = "夜間 (深み・青み補正)"; }
        else if (hour >= 4 && hour < 10) { baseR += 20; baseG += 20; timeLog = "早朝 (光・白み補正)"; }

        const bm = parseInt(document.getElementById("birth-month").value || 1);
        const bd = parseInt(document.getElementById("birth-day").value || 1);
        const bColor = (bm===1 && bd===17) ? {r:0, g:110, b:84} : hsvToRgb(((bm*30)+bd*5)%360, 40+(bd%60), 50+(bm%50));
        baseR = (baseR*0.9) + (bColor.r*0.1);
        baseG = (baseG*0.9) + (bColor.g*0.1);
        baseB = (baseB*0.9) + (bColor.b*0.1);

        let mainHex = rgbToHex(clamp(baseR), clamp(baseG), clamp(baseB));
        let subHex = rgbToHex(clamp(baseR+noise), clamp(baseG-noise), clamp(baseB+40));
        let accHex = wormCrushed ? "#ff0000" : rgbToHex(clamp(255-baseR), clamp(255-baseG), clamp(255-baseB));

        const favHex = document.getElementById("fav-color").value;
        const fRgb = hexToRgb(favHex);
        const gap = Math.round((Math.abs(fRgb.r-baseR) + Math.abs(fRgb.g-baseG) + Math.abs(fRgb.b-baseB)) / (255*3) * 100);

        document.body.style.background = `linear-gradient(135deg, #fff 0%, ${mainHex} 100%)`;
        document.getElementById("main-color-box").style.background = mainHex;
        document.getElementById("main-hex").textContent = mainHex;
        document.getElementById("sub-color-box").style.background = subHex;
        document.getElementById("sub-hex").textContent = subHex;
        document.getElementById("accent-color-box").style.background = accHex;
        document.getElementById("accent-hex").textContent = accHex;

        let w1 = selectedMotifs[0] ? selectedMotifs[0].word : "無色";
        let w2 = (100 - filledRatio) > 60 ? "余白" : (noise > 30 ? "揺らぎ" : "静寂");
        document.getElementById("poem-title").textContent = `「${w1}と${w2}の色彩」`;

        const finalLogs = `
            <li>長押し浸透率: ${(holdTime/1000).toFixed(1)}秒</li>
            <li>言語解析: ${textLog}</li>
            <li>心の余白: <strong>${100 - filledRatio}%</strong></li>
            <li>光の配置: ${posLog}</li>
            <li>時間帯: ${timeLog}</li>
            <li>待機耐性: ${skippedWait ? "待てない(ノイズ増幅)" : "待機成功"}</li>
            <li>理想色(${favHex})との乖離率: <strong>${gap}%</strong></li>
            <li>芋虫への干渉: ${wormCrushed ? "破壊 (赤色汚染)" : wormClicks+"回"}</li>
        `;
        document.getElementById("log-list").innerHTML = finalLogs;

        // --- 🌟 GAS送信 (スマホキャッシュ対策版) ---
        if (GAS_WEBAPP_URL) {
            const dbArea = document.getElementById("db-result");
            const cleanLogs = finalLogs.replace(/<[^>]*>?/gm, ''); 
            const query = new URLSearchParams({
                main: mainHex, sub: subHex, accent: accHex, logs: cleanLogs, _t: Date.now()
            }).toString();

            const timeoutId = setTimeout(() => {
                if (dbArea.innerHTML.includes("照合中")) dbArea.innerHTML = "※通信タイムアウト";
            }, 10000);

            window.gasCallback = function(data) {
                clearTimeout(timeoutId);
                if (data.error) { dbArea.innerHTML = `※エラー: ${data.details}`; return; }
                let html = data.perfectMatch === 0 ? 
                    `✨ 驚異的！全世界で<br><strong style="font-size:18px; color:#ff758c;">あなたが初めて</strong>この色を出しました。<br>` : 
                    `過去に <strong>${data.perfectMatch}人</strong> が<br>同じ3色に辿り着いています。<br>`;
                html += `<div style="font-size:11px;margin-top:5px;color:#777;">(1色一致: ${data.partialMatch}人)</div>`;
                dbArea.innerHTML = html;
                const oldS = document.getElementById("gas-script");
                if (oldS) oldS.remove();
            };

            const script = document.createElement("script");
            script.id = "gas-script";
            script.src = `${GAS_WEBAPP_URL}?${query}&callback=gasCallback`;
            script.onerror = () => { clearTimeout(timeoutId); dbArea.innerHTML = "※接続失敗"; };
            document.body.appendChild(script);
        }
    };

    // --- 📸 シェア・PC保存 ---
    const url = "https://mofu-mitsu.github.io/chroma-log/";
    document.getElementById("share-btn").onclick = async () => {
        const text = document.getElementById("poem-title").textContent + "になったよ！唯一無二の心理カラー診断";
        if (navigator.share) { await navigator.share({ title: "Chroma Log", text: text, url: url }); } 
        else { alert("URLをコピーしました！"); navigator.clipboard.writeText(url); }
    };

    document.getElementById("save-btn").onclick = () => {
        const target = document.getElementById("capture-target");
        html2canvas(target, { scale: 2, backgroundColor: "#ffffff" }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (!isMobile) {
                const link = document.createElement("a");
                link.href = imgData; link.download = "chromalog-result.png"; link.click();
            } else {
                document.getElementById("generated-image").src = imgData;
                document.getElementById("image-output").classList.remove("hidden");
            }
        });
    };

    document.getElementById("retry-btn").onclick = () => location.reload();
});
