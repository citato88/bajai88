(function () {
  "use strict";

  const BRAND_NAME = "BAJAI88";
  const MOBILE_BREAKPOINT = 768;
  const STORAGE_KEY = "selectedServerEvent";

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

  let isConnecting = false;
  let connectionToken = 0;
  const currentPercents = {};

  function injectStyle() {
    if (document.getElementById("server-selector-style-v2")) return;

    const style = document.createElement("style");
    style.id = "server-selector-style-v2";

    style.textContent = `
      .server-selector-ui {
        width: calc(100% - 20px);
        margin: 14px auto;
        position: relative;
        z-index: 99;
        font-family: Montserrat, Arial, sans-serif;
        filter: drop-shadow(0 10px 18px rgba(0,0,0,.55));
      }

      .server-panel {
        position: relative;
        padding: 14px;
        overflow: visible;
        color: #f7dc82;

        clip-path:
          polygon(
            14px 0,
            calc(100% - 14px) 0,
            100% 14px,
            100% calc(100% - 14px),
            calc(100% - 14px) 100%,
            14px 100%,
            0 calc(100% - 14px),
            0 14px
          );

        border: 1px solid #a96f1d;

        background:
          linear-gradient(
            rgba(20,4,18,.92),
            rgba(20,4,18,.92)
          ),
          conic-gradient(
            from 45deg at 50% 50%,
            #2b0826 0 25%,
            #130410 25% 50%,
            #3a0c32 50% 75%,
            #21071e 75% 100%
          ) 0 0 / 28px 24px repeat;

        box-shadow:
          inset 0 0 0 1px rgba(255,215,73,.08),
          inset 0 0 30px rgba(0,0,0,.68);
      }

      .server-panel::before {
        content: "";
        position: absolute;
        top: 0;
        left: 26px;
        right: 26px;
        height: 2px;
        background:
          linear-gradient(
            90deg,
            transparent,
            #c88a1e 20%,
            #ffe45b 50%,
            #c88a1e 80%,
            transparent
          );
      }

      .server-panel::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 26px;
        right: 26px;
        height: 1px;
        background:
          linear-gradient(
            90deg,
            transparent,
            #8b5918,
            #d69b2b,
            #8b5918,
            transparent
          );
      }

      .server-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin: 4px 2px 12px;
      }

      .server-heading {
        min-width: 0;
      }

      .server-mini-title {
        margin-bottom: 3px;
        color: #9f762f;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.6px;
      }

      .server-main-title {
        color: #ffe05b;
        font-size: 16px;
        line-height: 1;
        font-weight: 900;
        letter-spacing: .4px;
        text-transform: uppercase;
        text-shadow: 0 0 8px rgba(255,202,28,.25);
      }

      .server-description {
        margin-top: 5px;
        color: #a88a62;
        font-size: 9px;
        font-weight: 600;
      }

      .server-brand {
        flex: 0 0 auto;
        padding: 8px 11px;
        min-width: 68px;
        text-align: center;

        color: #211000;
        font-size: 10px;
        font-weight: 1000;
        letter-spacing: .4px;

        clip-path:
          polygon(
            7px 0,
            100% 0,
            100% calc(100% - 7px),
            calc(100% - 7px) 100%,
            0 100%,
            0 7px
          );

        background:
          linear-gradient(
            180deg,
            #fff07c,
            #ffd238 50%,
            #d88a10
          );

        box-shadow:
          inset 0 1px rgba(255,255,255,.7);
      }

      .server-line {
        height: 1px;
        margin-bottom: 12px;
        background:
          linear-gradient(
            90deg,
            transparent,
            #674317,
            #c58b27,
            #674317,
            transparent
          );
      }

      .server-field-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 2px 6px;
      }

      .server-field-title span:first-child {
        color: #d7b76d;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: .9px;
      }

      .server-live {
        display: inline-flex;
        align-items: center;
        gap: 5px;

        color: #9e835f;
        font-size: 9px;
        font-weight: 800;
      }

      .server-live::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #ffd43a;
        box-shadow: 0 0 7px rgba(255,212,58,.75);
      }

      .server-native-select {
        display: none !important;
      }

      .server-custom-select {
        position: relative;
        z-index: 50;
      }

      .server-custom-trigger {
        width: 100%;
        min-height: 50px;
        padding: 0 46px 0 14px;

        display: flex;
        align-items: center;

        position: relative;
        cursor: pointer;
        user-select: none;

        color: #ffe47c;
        font-size: 13px;
        font-weight: 900;

        border: 1px solid #93601b;

        clip-path:
          polygon(
            10px 0,
            100% 0,
            100% calc(100% - 10px),
            calc(100% - 10px) 100%,
            0 100%,
            0 10px
          );

        background:
          linear-gradient(
            90deg,
            rgba(255,205,55,.06),
            transparent 32%
          ),
          linear-gradient(
            180deg,
            #31092c,
            #160413
          );

        box-shadow:
          inset 0 1px rgba(255,255,255,.05),
          inset 0 -8px 14px rgba(0,0,0,.28);

        transition: .18s ease;
      }

      .server-custom-trigger:hover {
        border-color: #d29a2d;
      }

      .server-custom-select.open .server-custom-trigger {
        border-color: #ffd43a;

        box-shadow:
          inset 0 0 0 1px rgba(255,213,61,.08),
          0 0 0 2px rgba(255,210,50,.08);
      }

      .server-custom-label {
        width: 100%;
        min-width: 0;

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
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

        font-size: 11px;
        white-space: nowrap;
      }

      .server-selector-arrow {
        position: absolute;
        right: 16px;
        top: 50%;

        width: 10px;
        height: 10px;

        border-right: 2px solid #ffd43a;
        border-bottom: 2px solid #ffd43a;

        transform:
          translateY(-70%)
          rotate(45deg);

        transition: .2s;
      }

      .server-custom-select.open .server-selector-arrow {
        transform:
          translateY(-25%)
          rotate(225deg);
      }

      .server-custom-menu {
        position: absolute;
        top: calc(100% + 7px);
        left: 0;
        right: 0;

        padding: 6px;
        max-height: 260px;
        overflow-y: auto;

        border: 1px solid #77501c;

        background:
          linear-gradient(
            rgba(16,3,14,.96),
            rgba(16,3,14,.96)
          ),
          conic-gradient(
            from 45deg,
            #2b0826 0 25%,
            #130410 25% 50%,
            #3a0c32 50% 75%,
            #21071e 75%
          ) 0 0 / 28px 24px;

        box-shadow:
          0 16px 32px rgba(0,0,0,.72);

        opacity: 0;
        visibility: hidden;

        transform: translateY(8px);
        transition: .18s ease;
      }

      .server-custom-select.open .server-custom-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .server-custom-menu::-webkit-scrollbar {
        width: 4px;
      }

      .server-custom-menu::-webkit-scrollbar-thumb {
        background: #97661f;
      }

      .server-custom-option {
        min-height: 42px;
        padding: 9px 10px;
        margin-bottom: 4px;

        display: grid;
        grid-template-columns: minmax(0,1fr) auto;
        align-items: center;
        gap: 8px;

        color: #ddc07c;
        font-size: 11.5px;
        font-weight: 800;

        cursor: pointer;

        border-left: 2px solid transparent;

        background:
          linear-gradient(
            90deg,
            rgba(255,255,255,.025),
            transparent
          );

        transition: .15s;
      }

      .server-custom-option:last-child {
        margin-bottom: 0;
      }

      .server-custom-option:hover,
      .server-custom-option.selected {
        color: #ffe66d;
        border-left-color: #ffd43a;

        background:
          linear-gradient(
            90deg,
            rgba(255,200,35,.13),
            rgba(68,10,58,.42) 60%,
            transparent
          );
      }

      .server-option-name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .server-option-percent {
        margin-left: 8px;
        font-size: 11px;
        font-weight: 1000;
      }

      .server-signal {
        display: inline-flex;
        align-items: flex-end;
        gap: 2px;

        height: 11px;
        margin-right: 3px;
      }

      .server-signal .signal-bar {
        width: 2px;
        background: currentColor;
        opacity: .22;
      }

      .server-signal .signal-bar:nth-child(1) {
        height: 3px;
      }

      .server-signal .signal-bar:nth-child(2) {
        height: 5px;
      }

      .server-signal .signal-bar:nth-child(3) {
        height: 8px;
      }

      .server-signal .signal-bar:nth-child(4) {
        height: 11px;
      }

      .server-signal .signal-bar.active {
        opacity: 1;
      }

      .server-terminal-inline {
        margin-top: 10px;
        padding: 10px 11px;

        display: none;

        border-left: 2px solid #d49727;

        background: #0b0209;
      }

      .server-terminal-inline.show {
        display: block;
      }

      .server-terminal-inline-box {
        color: #efca55;
        font: 11px/1.65 Consolas, Monaco, monospace;
        white-space: pre-wrap;
      }

      .server-status {
        margin-top: 12px;
        padding: 9px 10px;

        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 9px;

        border: 1px solid #624017;

        background:
          linear-gradient(
            90deg,
            #150411,
            #280823 55%,
            #150411
          );
      }

      .server-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;

        background: #766c62;
      }

      .server-dot.active {
        background: #ffd43a;
        box-shadow: 0 0 8px rgba(255,212,58,.8);
      }

      .server-dot.pending {
        background: #ff4df0;
        box-shadow: 0 0 8px rgba(255,77,240,.7);
        animation: serverDotBlink .7s infinite;
      }

      @keyframes serverDotBlink {
        50% {
          opacity: .3;
        }
      }

      .server-status-text {
        color: #bda473;
        font-size: 10.5px;
        line-height: 1.35;
        font-weight: 600;
      }

      .server-status-text strong {
        color: #ffe05b;
        font-weight: 900;
      }
    `;

    document.head.appendChild(style);
  }

  function getSavedServer() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function saveServer(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {}
  }

  function removeServer() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function getServerData(value) {
    return ALLOWED_SERVERS.find(item => item.value === value) || null;
  }

  function getServerLabel(value) {
    const server = getServerData(value);
    return server ? server.label : "";
  }

  function hashString(str) {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      hash =
        ((hash << 5) - hash) +
        str.charCodeAt(i);

      hash |= 0;
    }

    return Math.abs(hash);
  }

  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function getDynamicPercent(value) {
    const server = getServerData(value);

    if (!server) return "0.00%";

    const bucketMs = 5 * 60 * 1000;
    const now = Date.now();

    const currentBucket =
      Math.floor(now / bucketMs);

    const nextBucket =
      currentBucket + 1;

    function bucketValue(bucket) {
      const seed =
        hashString(
          value +
          "|" +
          bucket +
          "|" +
          BRAND_NAME
        );

      const rand =
        seededRandom(seed);

      return (
        server.min +
        rand * (server.max - server.min)
      );
    }

    const start =
      bucketValue(currentBucket);

    const end =
      bucketValue(nextBucket);

    const progress =
      (now % bucketMs) / bucketMs;

    const eased =
      progress *
      progress *
      (3 - 2 * progress);

    let valueNow =
      start +
      (end - start) *
      eased;

    valueNow =
      Math.max(
        server.min,
        Math.min(server.max, valueNow)
      );

    const result =
      valueNow.toFixed(2) + "%";

    currentPercents[value] =
      result;

    return result;
  }

  function getMetaColor(percent) {
    const value =
      parseFloat(percent);

    if (value > 90)
      return "#00ff88";

    if (value > 75)
      return "#ffd43a";

    return "#ff4d4d";
  }

  function getSignalHtml(percent) {
    const value =
      parseFloat(percent);

    let level = 1;

    if (value > 90)
      level = 4;
    else if (value > 75)
      level = 3;
    else if (value > 60)
      level = 2;

    let html =
      '<span class="server-signal">';

    for (let i = 1; i <= 4; i++) {
      html +=
        '<span class="signal-bar' +
        (i <= level ? " active" : "") +
        '"></span>';
    }

    html += "</span>";

    return html;
  }

  function setDisconnectedState() {
    const dot =
      document.getElementById("serverDot");

    const text =
      document.getElementById("serverStatusText");

    const label =
      document.getElementById("serverCustomLabel");

    if (dot) {
      dot.classList.remove("active");
      dot.classList.remove("pending");
    }

    if (text) {
      text.textContent =
        "Status: Belum terhubung ke server";
    }

    if (label) {
      label.textContent =
        "Pilih Server";
    }
  }

  function setPendingState(label) {
    const dot =
      document.getElementById("serverDot");

    const text =
      document.getElementById("serverStatusText");

    if (dot) {
      dot.classList.remove("active");
      dot.classList.add("pending");
    }

    if (text) {
      text.innerHTML =
        "Menghubungkan ke <strong>" +
        label +
        "</strong>...";
    }
  }

  function setConnectedState(value) {
    const label =
      getServerLabel(value);

    const percent =
      getDynamicPercent(value);

    const dot =
      document.getElementById("serverDot");

    const text =
      document.getElementById("serverStatusText");

    const customLabel =
      document.getElementById("serverCustomLabel");

    if (dot) {
      dot.classList.remove("pending");
      dot.classList.add("active");
    }

    if (customLabel) {
      customLabel.innerHTML =
        '<span class="selected-server-name">' +
        label +
        '</span>' +

        '<span class="selected-server-meta" style="color:' +
        getMetaColor(percent) +
        ';">' +

        getSignalHtml(percent) +
        " " +
        percent +

        "</span>";
    }

    if (text) {
      text.innerHTML =
        'Terhubung ke <strong>' +
        label +
        "</strong>. Jalur server aktif.";
    }
  }

  function showTerminalSequence(lines, done, token) {
    const wrap =
      document.getElementById(
        "serverTerminalInline"
      );

    const box =
      document.getElementById(
        "serverTerminalInlineBox"
      );

    if (!wrap || !box) {
      if (done) done();
      return;
    }

    wrap.classList.add("show");
    box.innerHTML = "";

    let index = 0;

    function nextLine() {
      if (token !== connectionToken)
        return;

      if (index >= lines.length) {
        setTimeout(function () {
          wrap.classList.remove("show");
          box.innerHTML = "";

          if (done)
            done();
        }, 450);

        return;
      }

      const line =
        document.createElement("div");

      box.appendChild(line);

      const text =
        lines[index++];

      let charIndex = 0;

      function type() {
        if (token !== connectionToken)
          return;

        if (charIndex < text.length) {
          line.textContent +=
            text.charAt(charIndex++);

          setTimeout(type, 12);
        } else {
          setTimeout(nextLine, 120);
        }
      }

      type();
    }

    nextLine();
  }

  function applyServerSelection(value) {
    const menu =
      document.getElementById(
        "serverCustomSelect"
      );

    const label =
      getServerLabel(value);

    connectionToken++;

    if (menu)
      menu.classList.remove("open");

    if (!value || !label) {
      removeServer();
      isConnecting = false;
      setDisconnectedState();
      return;
    }

    isConnecting = true;

    setPendingState(label);

    const token =
      connectionToken;

    showTerminalSequence(
      [
        "> Memilih " + label,
        "> Memeriksa gateway...",
        "> Menguji respon jaringan...",
        "> Membuka jalur server...",
        "> Sinkronisasi sesi...",
        "> Koneksi berhasil"
      ],
      function () {
        if (token !== connectionToken)
          return;

        saveServer(value);

        isConnecting = false;

        setConnectedState(value);

        syncSelectedOption(value);
      },
      token
    );
  }

  function syncSelectedOption(value) {
    document
      .querySelectorAll(".server-custom-option")
      .forEach(function (option) {
        option.classList.toggle(
          "selected",
          option.dataset.value === value
        );
      });
  }

  function createUI() {
    if (
      document.getElementById(
        "server-selector-ui"
      )
    ) {
      return null;
    }

    const savedValue =
      getSavedServer();

    const savedLabel =
      getServerLabel(savedValue);

    const connected =
      !!savedValue &&
      !!savedLabel;

    const wrap =
      document.createElement("div");

    wrap.className =
      "server-selector-ui";

    wrap.id =
      "server-selector-ui";

    wrap.innerHTML = `
      <div class="server-panel">

        <div class="server-header">

          <div class="server-heading">

            <div class="server-mini-title">
              BAJAI88 CONNECTION SYSTEM
            </div>

            <div class="server-main-title">
              SERVER GACOR
            </div>

            <div class="server-description">
              Pilih jalur server terbaik
            </div>

          </div>

          <div class="server-brand">
            ${BRAND_NAME}
          </div>

        </div>

        <div class="server-line"></div>

        <div class="server-field-title">

          <span>
            SERVER GATEWAY
          </span>

          <span class="server-live">
            LIVE
          </span>

        </div>

        <select
          class="server-native-select"
          id="serverDropdown"
        >
          <option value="">
            Pilih Server
          </option>

          ${ALLOWED_SERVERS.map(
            item =>
              `<option value="${item.value}">
                ${item.label}
              </option>`
          ).join("")}

        </select>

        <div
          class="server-custom-select"
          id="serverCustomSelect"
        >

          <div
            class="server-custom-trigger"
            id="serverCustomTrigger"
          >

            <span
              class="server-custom-label"
              id="serverCustomLabel"
            >

              ${
                connected
                  ? `
                    <span class="selected-server-name">
                      ${savedLabel}
                    </span>
                  `
                  : "Pilih Server"
              }

            </span>

            <span
              class="server-selector-arrow"
            ></span>

          </div>

          <div
            class="server-custom-menu"
            id="serverCustomMenu"
          >

            <div
              class="server-custom-option"
              data-value=""
            >
              <span class="server-option-name">
                Pilih Server
              </span>
            </div>

            ${ALLOWED_SERVERS.map(function (item) {

              const percent =
                getDynamicPercent(item.value);

              return `
                <div
                  class="server-custom-option"
                  data-value="${item.value}"
                >

                  <span class="server-option-name">
                    ${item.label}
                  </span>

                  <span
                    class="server-option-percent"
                    data-percent-for="${item.value}"
                    style="color:${getMetaColor(percent)}"
                  >
                    ${getSignalHtml(percent)}
                    ${percent}
                  </span>

                </div>
              `;
            }).join("")}

          </div>

        </div>

        <div
          class="server-terminal-inline"
          id="serverTerminalInline"
        >
          <div
            class="server-terminal-inline-box"
            id="serverTerminalInlineBox"
          ></div>
        </div>

        <div class="server-status">

          <span
            class="server-dot ${
              connected
                ? "active"
                : ""
            }"
            id="serverDot"
          ></span>

          <div
            class="server-status-text"
            id="serverStatusText"
          >
            ${
              connected
                ? `Terhubung ke <strong>${savedLabel}</strong>. Jalur server aktif.`
                : "Status: Belum terhubung ke server"
            }
          </div>

        </div>

      </div>
    `;

    const trigger =
      wrap.querySelector(
        "#serverCustomTrigger"
      );

    const customSelect =
      wrap.querySelector(
        "#serverCustomSelect"
      );

    trigger.addEventListener(
      "click",
      function (e) {
        e.stopPropagation();

        customSelect.classList.toggle(
          "open"
        );
      }
    );

    wrap
      .querySelectorAll(
        ".server-custom-option"
      )
      .forEach(function (option) {

        option.addEventListener(
          "click",
          function (e) {
            e.stopPropagation();

            applyServerSelection(
              this.dataset.value || ""
            );
          }
        );
      });

    document.addEventListener(
      "click",
      function (e) {

        if (!wrap.contains(e.target)) {
          customSelect.classList.remove(
            "open"
          );
        }
      }
    );

    if (connected) {
      setTimeout(function () {
        setConnectedState(savedValue);
        syncSelectedOption(savedValue);
      }, 0);
    }

    return wrap;
  }

  function startPercentUpdates() {
    function update() {
      document
        .querySelectorAll(
          "[data-percent-for]"
        )
        .forEach(function (el) {

          const value =
            el.dataset.percentFor;

          const percent =
            getDynamicPercent(value);

          el.style.color =
            getMetaColor(percent);

          el.innerHTML =
            getSignalHtml(percent) +
            " " +
            percent;
        });

      const saved =
        getSavedServer();

      if (
        saved &&
        !isConnecting
      ) {
        setConnectedState(saved);
      }

      setTimeout(
        update,
        3000 + Math.random() * 2000
      );
    }

    update();
  }

  function findTarget() {
    for (
      const selector
      of TARGET_SELECTORS
    ) {
      const target =
        document.querySelector(selector);

      if (target)
        return target;
    }

    return null;
  }

  function init() {
    if (
      window.innerWidth >
      MOBILE_BREAKPOINT
    ) {
      return;
    }

    let attempts = 0;

    const interval =
      setInterval(function () {

        attempts++;

        const target =
          findTarget();

        if (target) {
          injectStyle();

          const ui =
            createUI();

          if (ui) {

            if (
              typeof createApkBox ===
              "function"
            ) {

              const apkBox =
                createApkBox();

              if (
                apkBox &&
                !apkBox.parentNode
              ) {

                target.insertAdjacentElement(
                  "beforebegin",
                  apkBox
                );

                apkBox.insertAdjacentElement(
                  "afterend",
                  ui
                );

              } else {

                target.insertAdjacentElement(
                  "afterend",
                  ui
                );
              }

            } else {

              target.insertAdjacentElement(
                "afterend",
                ui
              );
            }

            startPercentUpdates();
          }

          clearInterval(interval);
        }

        if (attempts >= 40) {
          clearInterval(interval);
        }

      }, 500);
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
