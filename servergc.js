/*
==========================
  SERVER SELECTOR SYSTEM
==========================
*/
(function () {
  "use strict";

  const BRAND_NAME = "BAJAI88";

  const ALLOWED_SERVERS = [
    { value: "indonesia", label: "Server Indonesia", min: 40.20, max: 99.80 },
    { value: "singapura", label: "Server Singapura", min: 42.90, max: 99.85 },
    { value: "singapore_vip", label: "Server Singapura VIP", min: 85.30, max: 99.95 },
    { value: "malaysia", label: "Server Malaysia", min: 41.80, max: 99.70 },
    { value: "thailand", label: "Server Thailand", min: 40.00, max: 99.85 },
    { value: "filipina", label: "Server Filipina", min: 40.70, max: 99.60 },
    { value: "kamboja", label: "Server Kamboja", min: 40.90, max: 99.50 },
    { value: "vietnam", label: "Server Vietnam", min: 41.10, max: 99.45 },
    { value: "china", label: "Server China", min: 40.85, max: 99.65 },
    { value: "hongkong", label: "Server Hongkong", min: 41.20, max: 99.88 },
    { value: "macau", label: "Server Macau", min: 41.75, max: 99.78 },
    { value: "macau_vip", label: "Server Macau VIP", min: 85.45, max: 99.98 },
    { value: "jepang", label: "Server Jepang", min: 42.70, max: 99.95 },
    { value: "korea", label: "Server Korea", min: 43.50, max: 99.78 }
  ];

  const TARGET_SELECTORS = [
    ".progressive-jackpot-text-wrapper",
    ".progressive-jackpot-text",
    ".jackpot",
    ".main-menu-outer-container"
  ];
  const STORAGE_KEY = "selectedServerEvent";
  const MOBILE_BREAKPOINT = 768;
  const INSERT_POSITION = "afterend";

  function injectStyle() {
    if (document.getElementById("server-selector-style")) return;

    const style = document.createElement("style");
    style.id = "server-selector-style";
    style.textContent = `
      .server-selector-ui {
        width: calc(100% - 20px);
        max-width: 100%;
        margin: 12px auto 14px;
        padding: 14px;
        box-sizing: border-box;
        position: relative;
        overflow: visible;
        z-index: 99;
        font-family: Montserrat, Arial, sans-serif;
        border-radius: 12px;
        background:
          radial-gradient(circle at top left, rgba(255, 196, 0, .10), transparent 30%),
          radial-gradient(circle at bottom right, rgba(214, 0, 255, .12), transparent 34%),
          linear-gradient(180deg, #120313 0%, #1b0624 45%, #09050f 100%);
        border: 1px solid rgba(255, 199, 59, .70);
        box-shadow:
          0 0 0 1px rgba(255, 213, 92, .10) inset,
          0 0 16px rgba(214, 0, 255, .14),
          0 8px 24px rgba(0,0,0,.42);
      }

      .server-selector-ui::before {
        display: none !important;
      }

      .server-selector-ui::after {
        content: "";
        position: absolute;
        left: 12px;
        right: 12px;
        top: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 204, 68, .45), transparent);
        pointer-events: none;
      }

      @keyframes serverSelectorShine {
        to { transform: translateX(120%); }
      }

      .server-selector-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 12px;
        position: relative;
        z-index: 2;
      }

      .server-selector-title {
        color: #ffd54a;
        font-size: 14px;
        font-weight: 800;
        line-height: 1.15;
        letter-spacing: .4px;
        text-transform: uppercase;
        text-shadow: 0 0 8px rgba(255, 195, 0, .24);
      }

      .server-selector-sub {
        display: none;
      }

      .server-selector-badge {
        position: relative;
        flex: 0 0 auto;
        width: auto;
        padding: 6px 11px;
        border-radius: 8px;
        text-align: center;
        color: #ffd86a;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .2px;
        text-transform: uppercase;
        white-space: nowrap;
        background: linear-gradient(180deg, rgba(85, 10, 101, .92), rgba(43, 8, 50, .95));
        border: 1px solid rgba(255, 194, 58, .42);
        box-shadow:
          0 0 10px rgba(214, 0, 255, .10),
          0 0 0 1px rgba(255,255,255,.02) inset;
      }

      .server-selector-badge::before,
      .server-selector-badge::after {
        content: none;
      }

      .server-selector-field {
        position: relative;
        z-index: 20;
      }

      .server-native-select {
        display: none !important;
      }

      .server-custom-select {
        position: relative;
      }

      .server-custom-trigger {
        width: 100%;
        min-height: 46px;
        padding: 0 42px 0 14px;
        border-radius: 14px;
        border: 1px solid rgba(255, 197, 59, .42);
        cursor: pointer;
        transition: .25s ease;
        color: #ffe082;
        font-size: 13px;
        font-weight: 800;
        display: flex;
        align-items: center;
        position: relative;
        user-select: none;
        background: linear-gradient(180deg, rgba(41, 8, 46, .96), rgba(20, 7, 25, .98));
        box-shadow:
          0 0 0 1px rgba(255,255,255,.02) inset,
          0 6px 14px rgba(0,0,0,.20);
      }

      .server-custom-trigger:hover {
        transform: translateY(-1px);
        border-color: rgba(255, 214, 87, .76);
        box-shadow:
          0 0 0 3px rgba(255, 184, 28, .08),
          0 0 12px rgba(214, 0, 255, .14),
          0 6px 14px rgba(0,0,0,.22);
      }

      .server-custom-select.open .server-custom-trigger {
        border-color: rgba(255, 214, 87, .90);
        box-shadow:
          0 0 0 3px rgba(255, 184, 28, .12),
          0 0 12px rgba(214, 0, 255, .16);
      }

      .server-custom-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        width: 100%;
        min-width: 0;
        padding-right: 8px;
      }

      .selected-server-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .selected-server-meta {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
        font-size: 11px;
        line-height: 1;
      }

      .server-selector-arrow {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        pointer-events: none;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 8px solid #ffd04d;
        filter: drop-shadow(0 0 8px rgba(255, 187, 0, .24));
        transition: .25s ease;
      }

      .server-custom-select.open .server-selector-arrow {
        transform: translateY(-50%) rotate(180deg);
      }

      .server-custom-menu {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        padding: 8px;
        border-radius: 14px;
        background: linear-gradient(180deg, rgba(25, 8, 33, .98), rgba(10, 5, 16, .98));
        border: 1px solid rgba(255, 191, 42, .28);
        box-shadow:
          0 16px 34px rgba(0,0,0,.42),
          0 0 16px rgba(214, 0, 255, .12),
          inset 0 1px 0 rgba(255,255,255,.04);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        opacity: 0;
        visibility: hidden;
        transform: translateY(8px);
        transition: .22s ease;
        max-height: 260px;
        overflow-y: auto;
      }

      .server-custom-select.open .server-custom-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .server-custom-menu::-webkit-scrollbar {
        width: 6px;
      }

      .server-custom-menu::-webkit-scrollbar-thumb {
        background: rgba(255, 214, 51, 0.35);
        border-radius: 99px;
      }

      .server-custom-option {
        position: relative;
        min-height: 44px;
        padding: 11px 12px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        color: #f5d98d;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .2px;
        cursor: pointer;
        transition: .18s ease;
        background: transparent;
        border: 1px solid transparent;
      }

      .server-custom-option:hover {
        color: #ffe45c;
        background: linear-gradient(180deg, rgba(36, 8, 45, .95), rgba(17, 7, 23, .98));
        border-color: rgba(255, 189, 42, .22);
        box-shadow:
          inset 0 1px 0 rgba(255,255,255,.03),
          0 0 12px rgba(214, 0, 255, .10);
      }

      .server-custom-option.selected {
        color: #ffd54a;
        background: linear-gradient(180deg, rgba(41, 8, 46, .96), rgba(20, 7, 25, .98));
        border: 1px solid rgba(255, 197, 59, .42);
        box-shadow:
          0 0 10px rgba(214, 0, 255, .10),
          inset 0 1px 0 rgba(255,255,255,0.04);
      }

      .server-terminal-inline {
        margin-top: 10px;
        padding: 10px 12px;
        display: none;
        position: relative;
        z-index: 2;
        border-radius: 12px;
        background: linear-gradient(180deg, rgba(25, 8, 33, .96), rgba(10, 5, 16, .98));
        border: 1px solid rgba(255, 191, 42, .20);
        box-shadow:
          0 0 0 1px rgba(255,255,255,.02) inset,
          0 6px 14px rgba(0,0,0,.18);
      }

      .server-terminal-inline.show {
        display: block;
      }

      .server-terminal-inline-box {
        color: #ffe45c;
        font-family: Consolas, Monaco, monospace;
        font-size: 12px;
        line-height: 1.7;
        white-space: pre-wrap;
        text-shadow: 0 0 8px rgba(255, 188, 0, .14);
      }

      .server-status {
        margin-top: 12px;
        padding: 12px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;
        z-index: 2;
        background: linear-gradient(180deg, rgba(36, 8, 45, .95), rgba(17, 7, 23, .98));
        border: 1px solid rgba(255, 189, 42, .22);
        box-shadow: 0 0 0 1px rgba(255,255,255,.02) inset;
      }

      .server-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex: 0 0 10px;
        background: #8d7d72;
        transition: .25s ease;
      }

      .server-dot.active {
        background: #ffd54a;
        box-shadow:
          0 0 8px rgba(255, 208, 74, .75),
          0 0 14px rgba(255, 176, 0, .28);
      }

      .server-dot.pending {
        background: #ff4df0;
        box-shadow:
          0 0 8px rgba(255, 77, 240, .55),
          0 0 14px rgba(255, 77, 240, .20);
        animation: serverPulse 1s infinite ease-in-out;
      }

      @keyframes serverPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.15); opacity: .7; }
      }

      .server-status-text {
        color: #f5d98d;
        font-size: 12.5px;
        line-height: 1.45;
        font-weight: 500;
      }

      .server-status-text strong {
        color: #ffd54a;
        font-weight: 800;
      }

      .server-option-name {
        flex: 1;
        min-width: 0;
      }

      .server-option-percent {
        flex: 0 0 auto;
        margin-left: 12px;
        color: #ffd43a;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: .2px;
      }

      .server-signal {
        display: inline-flex;
        align-items: flex-end;
        gap: 2px;
        margin-right: 4px;
        height: 12px;
      }

      .server-signal .signal-bar {
        width: 3px;
        background: currentColor;
        border-radius: 1px;
        opacity: 0.25;
        transition: 0.2s;
      }

      .server-signal .signal-bar:nth-child(1) { height: 4px; }
      .server-signal .signal-bar:nth-child(2) { height: 6px; }
      .server-signal .signal-bar:nth-child(3) { height: 8px; }
      .server-signal .signal-bar:nth-child(4) { height: 10px; }

      .server-signal .signal-bar.active {
        opacity: 1;
      }
    `;

    document.head.appendChild(style);
  }

  let isConnecting = false;
  let activeConnectionToken = 0;
  var currentPercents = {};

  function getSavedServer() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function setSavedServer(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function removeSavedServer() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function getServerLabel(value) {
    for (var i = 0; i < ALLOWED_SERVERS.length; i++) {
      if (ALLOWED_SERVERS[i].value === value) return ALLOWED_SERVERS[i].label;
    }
    return "";
  }

  function getServerData(value) {
    for (var i = 0; i < ALLOWED_SERVERS.length; i++) {
      if (ALLOWED_SERVERS[i].value === value) return ALLOWED_SERVERS[i];
    }
    return null;
  }

  function hashString(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function getDynamicPercent(value) {
    var server = getServerData(value);
    if (!server) return "0.00%";

    var bucketMs = 5 * 60 * 1000;
    var now = Date.now();
    var currentBucket = Math.floor(now / bucketMs);
    var nextBucket = currentBucket + 1;

    function getBucketValue(bucket) {
      var seed = hashString(value + "|" + bucket + "|" + BRAND_NAME);
      var rand = seededRandom(seed);
      return server.min + rand * (server.max - server.min);
    }

    var startValue = getBucketValue(currentBucket);
    var endValue = getBucketValue(nextBucket);
    var progress = (now % bucketMs) / bucketMs;
    var eased = progress * progress * (3 - 2 * progress);
    var liveValue = startValue + (endValue - startValue) * eased;

    if (liveValue > server.max) liveValue = server.max;
    if (liveValue < server.min) liveValue = server.min;

    var result = liveValue.toFixed(2) + "%";
    currentPercents[value] = result;
    return result;
  }

  function getSignalHtml(percent) {
    var num = parseFloat(percent);
    var level = 1;

    if (num > 90) level = 4;
    else if (num > 75) level = 3;
    else if (num > 60) level = 2;

    var barsHtml = "";
    for (var i = 1; i <= 4; i++) {
      barsHtml += '<span class="signal-bar' + (i <= level ? " active" : "") + '"></span>';
    }

    return '<span class="server-signal">' + barsHtml + "</span>";
  }

  function getMetaColor(percent) {
    var num = parseFloat(percent);
    if (num > 90) return "#00ff88";
    if (num > 75) return "#ffd43a";
    return "#ff4d4d";
  }

  function setPendingState(label) {
    var dot = document.getElementById("serverDot");
    var statusText = document.getElementById("serverStatusText");

    if (!dot || !statusText) return;

    dot.classList.remove("active");
    dot.classList.add("pending");
    statusText.innerHTML = 'Menghubungkan ke <strong>' + label + '</strong>...';
  }

  function setConnectedState(label) {
    var dot = document.getElementById("serverDot");
    var statusText = document.getElementById("serverStatusText");
    var savedValue = getSavedServer();
    var customLabel = document.getElementById("serverCustomLabel");
    var percent = currentPercents[savedValue] || getDynamicPercent(savedValue);

    if (!dot || !statusText) return;

    dot.classList.remove("pending");
    dot.classList.add("active");

    if (customLabel) {
      customLabel.innerHTML =
        '<span class="selected-server-name">' + label + '</span>' +
        '<span class="selected-server-meta" style="color:' + getMetaColor(percent) + ';">' +
        getSignalHtml(percent) + " " + percent + "</span>";
    }

    statusText.innerHTML = 'Terhubung ke <strong>' + label + '</strong>. Selamat bermain di ' + BRAND_NAME + '!';
  }

  function setDisconnectedState() {
    var dot = document.getElementById("serverDot");
    var statusText = document.getElementById("serverStatusText");
    var nativeSelect = document.getElementById("serverDropdown");
    var customLabel = document.getElementById("serverCustomLabel");
    var customSelect = document.getElementById("serverCustomSelect");

    if (dot) {
      dot.classList.remove("active");
      dot.classList.remove("pending");
    }

    if (statusText) {
      statusText.textContent = "Status: Belum terhubung ke server";
    }

    if (nativeSelect) {
      nativeSelect.value = "";
    }

    if (customLabel) {
      customLabel.textContent = "Pilih Server";
    }

    if (customSelect) {
      syncSelectedOption("");
      customSelect.classList.remove("open");
    }
  }

  function syncSelectedOption(value) {
    var options = document.querySelectorAll(".server-custom-option");
    for (var i = 0; i < options.length; i++) {
      options[i].classList.toggle("selected", options[i].getAttribute("data-value") === value);
    }
  }

  function updateUIState() {
    if (isConnecting) return;

    var savedValue = getSavedServer();
    var savedLabel = getServerLabel(savedValue);
    var nativeSelect = document.getElementById("serverDropdown");
    var customLabel = document.getElementById("serverCustomLabel");

    if (nativeSelect) nativeSelect.value = savedValue || "";

    if (customLabel && !savedValue) {
      customLabel.textContent = "Pilih Server";
    }

    syncSelectedOption(savedValue || "");

    if (savedValue && savedLabel) {
      setConnectedState(savedLabel);
    } else {
      setDisconnectedState();
    }
  }

  function clearTerminal() {
    var terminalWrap = document.getElementById("serverTerminalInline");
    var terminalBox = document.getElementById("serverTerminalInlineBox");

    if (terminalWrap) terminalWrap.classList.remove("show");
    if (terminalBox) terminalBox.innerHTML = "";
  }

  function refreshConnectedStatusPercent() {
    var savedValue = getSavedServer();
    var savedLabel = getServerLabel(savedValue);
    var dot = document.getElementById("serverDot");

    if (!savedValue || !savedLabel || !dot) return;
    if (!dot.classList.contains("active")) return;

    setConnectedState(savedLabel);
  }

  function showTerminalSequence(lines, onComplete, token) {
    var terminalWrap = document.getElementById("serverTerminalInline");
    var terminalBox = document.getElementById("serverTerminalInlineBox");

    if (!terminalWrap || !terminalBox) {
      if (typeof onComplete === "function") onComplete();
      return;
    }

    terminalBox.innerHTML = "";
    terminalWrap.classList.add("show");

    var lineIndex = 0;

    function typeLine(text, done) {
      if (token !== activeConnectionToken) return;

      var i = 0;
      var line = document.createElement("div");
      terminalBox.appendChild(line);

      function tick() {
        if (token !== activeConnectionToken) return;

        if (i < text.length) {
          line.textContent += text.charAt(i++);
          setTimeout(tick, 14);
        } else {
          setTimeout(done, 170);
        }
      }

      tick();
    }

    function next() {
      if (token !== activeConnectionToken) return;

      if (lineIndex < lines.length) {
        typeLine(lines[lineIndex++], next);
      } else {
        setTimeout(function () {
          if (token !== activeConnectionToken) return;
          terminalWrap.classList.remove("show");
          terminalBox.innerHTML = "";
          if (typeof onComplete === "function") onComplete();
        }, 700);
      }
    }

    next();
  }

  function applyServerSelection(value) {
    var currentSavedValue = getSavedServer();
    var nativeSelect = document.getElementById("serverDropdown");
    var customLabel = document.getElementById("serverCustomLabel");
    var customSelect = document.getElementById("serverCustomSelect");
    var label = getServerLabel(value);

    if (value && currentSavedValue === value && !isConnecting) {
      if (nativeSelect) nativeSelect.value = value;
      syncSelectedOption(value);
      if (customSelect) customSelect.classList.remove("open");
      setConnectedState(label);
      return;
    }

    activeConnectionToken++;

    if (nativeSelect) nativeSelect.value = value;

    if (customLabel) {
      customLabel.innerHTML = '<span class="selected-server-name">' + (label || "Pilih Server") + '</span>';
    }

    syncSelectedOption(value);

    if (customSelect) {
      customSelect.classList.remove("open");
    }

    if (value && label) {
      isConnecting = true;
      setPendingState(label);

      var currentToken = activeConnectionToken;

      showTerminalSequence([
        "> Menginisialisasi: " + label,
        "> Memvalidasi koneksi server...",
        "> Respon gateway diterima",
        "> Membuka jalur koneksi aman...",
        "> Menyinkronkan data sesi...",
        "> Koneksi BERHASIL — Selamat datang di " + BRAND_NAME
      ], function () {
        if (currentToken !== activeConnectionToken) return;
        setSavedServer(value);
        isConnecting = false;
        setConnectedState(label);
      }, currentToken);
    } else {
      isConnecting = false;
      removeSavedServer();
      clearTerminal();
      setDisconnectedState();
    }
  }

  function createUI() {
    var existing = document.getElementById("server-selector-ui");
    if (existing) return existing;

    var savedValue = getSavedServer();
    var savedLabel = getServerLabel(savedValue);
    var connected = !!savedValue && !!savedLabel;

    var wrap = document.createElement("div");
    wrap.className = "server-selector-ui";
    wrap.id = "server-selector-ui";

    wrap.innerHTML = `
      <div class="server-selector-head">
        <div>
          <div class="server-selector-title">Server Gacor</div>
          <div class="server-selector-sub">Pilih Server Gacor yang Tersedia</div>
        </div>
        <div class="server-selector-badge">${BRAND_NAME}</div>
      </div>

      <div class="server-selector-field">
        <select class="server-native-select" id="serverDropdown" aria-hidden="true" tabindex="-1">
          <option value="">Pilih Server</option>
          ${ALLOWED_SERVERS.map(function (item) {
            return '<option value="' + item.value + '"' + (item.value === savedValue ? " selected" : "") + '>' + item.label + '</option>';
          }).join("")}
        </select>

        <div class="server-custom-select" id="serverCustomSelect">
          <div class="server-custom-trigger" id="serverCustomTrigger" tabindex="0" role="button" aria-haspopup="listbox" aria-expanded="false">
            <span class="server-custom-label" id="serverCustomLabel">${
              savedLabel
                ? '<span class="selected-server-name">' + savedLabel + '</span>' +
                  '<span class="selected-server-meta" style="color:' + getMetaColor(getDynamicPercent(savedValue)) + ';">' +
                  getSignalHtml(getDynamicPercent(savedValue)) + " " + getDynamicPercent(savedValue) + "</span>"
                : "Pilih Server"
            }</span>
            <span class="server-selector-arrow"></span>
          </div>

          <div class="server-custom-menu" id="serverCustomMenu" role="listbox">
            <div class="server-custom-option ${savedValue === "" ? "selected" : ""}" data-value="">List Server</div>
            ${ALLOWED_SERVERS.map(function (item) {
              var percent = getDynamicPercent(item.value);
              return '<div class="server-custom-option ' + (item.value === savedValue ? "selected" : "") + '" data-value="' + item.value + '">' +
                '<span class="server-option-name">' + item.label + '</span>' +
                '<span class="server-option-percent" style="color:' + getMetaColor(percent) + ';" data-percent-for="' + item.value + '">' +
                getSignalHtml(percent) + " " + percent +
                '</span>' +
                '</div>';
            }).join("")}
          </div>
        </div>
      </div>

      <div class="server-terminal-inline" id="serverTerminalInline">
        <div class="server-terminal-inline-box" id="serverTerminalInlineBox"></div>
      </div>

      <div class="server-status">
        <span class="server-dot ${connected ? "active" : ""}" id="serverDot"></span>
        <div class="server-status-text" id="serverStatusText">
          ${connected
            ? 'Terhubung ke <strong>' + savedLabel + '</strong>. Selamat bermain di ' + BRAND_NAME + '!'
            : 'Status: Belum terhubung ke server'}
        </div>
      </div>
    `;

    var customSelect = wrap.querySelector("#serverCustomSelect");
    var trigger = wrap.querySelector("#serverCustomTrigger");
    var options = wrap.querySelectorAll(".server-custom-option");

    function closeMenu() {
      customSelect.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    }

    function openMenu() {
      customSelect.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    }

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      customSelect.classList.contains("open") ? closeMenu() : openMenu();
    });

    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        customSelect.classList.contains("open") ? closeMenu() : openMenu();
      } else if (e.key === "Escape") {
        closeMenu();
      }
    });

    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener("click", function (e) {
        e.stopPropagation();
        applyServerSelection(this.getAttribute("data-value"));
      });
    }

    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) closeMenu();
    });

    return wrap;
  }

  function startRandomUpdates() {
    var percentEls = document.querySelectorAll("[data-percent-for]");

    for (var i = 0; i < percentEls.length; i++) {
      (function (el) {
        function updateOne() {
          var value = el.getAttribute("data-percent-for");
          var percent = getDynamicPercent(value);

          el.innerHTML = getSignalHtml(percent) + " " + percent;
          el.style.color = getMetaColor(percent);

          if (value === getSavedServer()) {
            refreshConnectedStatusPercent();
          }

          var delay = Math.random() * 3000 + 1000;
          setTimeout(updateOne, delay);
        }

        updateOne();
      })(percentEls[i]);
    }
  }

  function init() {
    if (window.innerWidth > MOBILE_BREAKPOINT) return;
    if (!document.querySelector(".jackpot")) return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;

      let target = null;

      for (const sel of TARGET_SELECTORS) {
        target = document.querySelector(sel);
        if (target) break;
      }

      if (target) {
        injectStyle();

        const ui = createUI();

        if (ui && !ui.parentNode) {
          if (typeof createApkBox === "function") {
            const apkBox = createApkBox();

            if (apkBox && !apkBox.parentNode) {
              target.insertAdjacentElement("beforebegin", apkBox);
              apkBox.insertAdjacentElement("afterend", ui);
            } else {
              target.insertAdjacentElement(INSERT_POSITION, ui);
            }
          } else {
            target.insertAdjacentElement(INSERT_POSITION, ui);
          }

          updateUIState();
          startRandomUpdates();
        }

        clearInterval(interval);
      }

      if (attempts >= 40) {
        clearInterval(interval);
      }
    }, 500);

    window.addEventListener("storage", updateUIState);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
