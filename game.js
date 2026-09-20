(function(){
  "use strict";
  var BOT = "assets/robot.webp";
  var imgs = document.querySelectorAll("img.bot-img");
  for (var i = 0; i < imgs.length; i++) imgs[i].src = BOT;

  var REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TRAVEL = REDUCED ? 250 : 1600;

  /* ---------- data (edit here) ----------
     lon/lat are schematic map positions; the three Hejaz cities are spread slightly so they don't overlap.
     side: label position ("l" left, "r" right, default below). tx/ty: robot offset from the city. */
  var STOPS = [
    { name: "الطائف",         lon: 41.35, lat: 20.55, label: "البداية: الطائف", side: "r" },
    { name: "جدة",            lon: 39.35, lat: 21.95, side: "l" },
    { name: "الرياض",         lon: 46.70, lat: 24.70 },
    { name: "أبها",           lon: 42.50, lat: 18.25 },
    { name: "الدمام",         lon: 50.00, lat: 26.50, side: "r" },
    { name: "مكة المكرمة",    lon: 40.25, lat: 21.10, side: "l" },
    { name: "الأحساء",        lon: 49.25, lat: 25.15 },
    { name: "العلا",          lon: 37.95, lat: 26.60 },
    { name: "حائل",           lon: 41.70, lat: 27.50 },
    { name: "المدينة المنورة", lon: 39.60, lat: 24.45 }
  ];
  var N = STOPS.length;
  var QUESTIONS = [
    { q: "متى تحتفل المملكة العربية السعودية باليوم الوطني؟",
      a: ["23 سبتمبر", "22 فبراير", "1 يناير", "18 ديسمبر"],
      info: "يُحتفل باليوم الوطني السعودي في 23 سبتمبر من كل عام، تخليدًا لتوحيد المملكة العربية السعودية." },
    { q: "بماذا تُعرف مدينة جدة؟",
      a: ["عروس البحر الأحمر", "مدينة الضباب", "عروس الخليج", "مدينة النخيل"],
      info: "تُعرف جدة بعروس البحر الأحمر لموقعها على ساحله الغربي." },
    { q: "ما عاصمة المملكة العربية السعودية؟",
      a: ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة"],
      info: "الرياض هي العاصمة ومقر الحكم في المملكة." },
    { q: "ما أعلى قمة جبلية في المملكة العربية السعودية؟",
      a: ["جبل السودة", "جبل أحد", "جبل النور", "جبل طويق"],
      info: "يقع جبل السودة في منطقة عسير قرب أبها، ويرتفع أكثر من 3,000 متر عن سطح البحر." },
    { q: "على أي مسطح مائي تطل مدينة الدمام؟",
      a: ["الخليج العربي", "البحر الأحمر", "بحر العرب", "البحر المتوسط"],
      info: "تطل الدمام على الخليج العربي في المنطقة الشرقية." },
    { q: "ما اسم المسجد الذي تقع فيه الكعبة المشرفة؟",
      a: ["المسجد الحرام", "المسجد النبوي", "مسجد قباء", "المسجد الأقصى"],
      info: "تقع الكعبة المشرفة في المسجد الحرام بمكة المكرمة." },
    { q: "ما العملة الرسمية للمملكة العربية السعودية؟",
      a: ["الريال السعودي", "الدينار السعودي", "الدرهم السعودي", "الجنيه السعودي"],
      info: "الريال السعودي هو العملة الرسمية للمملكة." },
    { q: "بماذا تشتهر العلا؟",
      a: ["مدائن صالح", "الكثبان الثلجية", "الجزر المرجانية", "الغابات الاستوائية"],
      info: "مدائن صالح (الحِجر) في العلا أول موقع سعودي يُدرج في قائمة التراث العالمي لليونسكو." },
    { q: "من هو مؤسس المملكة العربية السعودية؟",
      a: ["الملك عبدالعزيز بن عبدالرحمن آل سعود", "الملك سعود بن عبدالعزيز", "الملك فيصل بن عبدالعزيز", "الملك خالد بن عبدالعزيز"],
      info: "وحّد الملك عبدالعزيز أجزاء المملكة، وأُعلن قيام المملكة العربية السعودية عام 1932م." },
    { q: "ماذا يوجد على علم المملكة العربية السعودية؟",
      a: ["الشهادتان وسيف", "نخلة وسيف", "نجمة وهلال", "تاج وسيف"],
      info: "يحمل علم المملكة الشهادتين وتحتهما سيف على أرضية خضراء." }
  ];
  var ORD = ["اللاعب الأول", "اللاعب الثاني"];
  var OUTLINE = [[34.95,29.35],[36.07,29.2],[37.0,29.9],[37.6,30.4],[38.0,30.95],[39.2,32.15],[40.0,31.95],[41.0,31.4],[42.1,31.1],
    [43.5,29.95],[44.7,29.2],[46.55,29.1],[47.45,28.95],[48.4,28.55],[48.6,27.8],[49.3,27.3],[49.7,27.0],[50.2,26.6],[50.15,26.0],
    [50.05,25.55],[50.6,24.95],[50.85,24.7],[51.6,24.25],[52.6,22.95],[55.15,22.65],[55.67,22.0],[54.9,20.0],[52.0,19.0],[49.0,18.6],
    [47.5,17.6],[46.3,17.2],[44.5,17.4],[43.3,17.3],[42.8,16.7],[42.75,16.4],[42.5,17.0],[42.1,17.9],[41.5,18.9],[40.9,19.8],
    [40.3,20.6],[39.7,21.2],[39.2,21.5],[39.0,22.3],[39.0,22.8],[38.4,23.7],[37.95,24.2],[37.3,25.1],[36.45,26.25],[35.7,27.35],[35.1,28.2]];

  /* ---------- map geometry ---------- */
  var W = 830, H = 690, X0 = 33.2, Y0 = 32.8;
  function proj(lon, lat){ return { x: (lon - X0) * 36, y: (Y0 - lat) * 40 }; }
  var pts = STOPS.map(function(s){ var p = proj(s.lon, s.lat); return { x: p.x, y: p.y }; });
  var outlineD = "M" + OUTLINE.map(function(c){ var p = proj(c[0], c[1]); return p.x.toFixed(1) + "," + p.y.toFixed(1); }).join("L") + "Z";
  var routeD = "M" + pts.map(function(p){ return p.x.toFixed(1) + "," + p.y.toFixed(1); }).join("L");

  var $ = function(id){ return document.getElementById(id); };
  var screens = { start: $("start"), setup: $("setup"), map: $("map"), quiz: $("quiz"), end: $("end") };

  $("ghostsvg").innerHTML =
    '<path d="' + outlineD + '" fill="rgba(255,255,255,.09)" stroke="rgba(255,255,255,.5)" stroke-width="2.5" stroke-linejoin="round"/>';

  var svg = $("mapsvg");
  var segHtml = "";
  for (var s = 0; s < N - 1; s++){
    segHtml += '<path class="route-seg" pathLength="1" d="M' + pts[s].x.toFixed(1) + ',' + pts[s].y.toFixed(1) + 'L' + pts[s+1].x.toFixed(1) + ',' + pts[s+1].y.toFixed(1) + '"/>';
  }
  svg.innerHTML =
    '<path class="land" d="' + outlineD + '"/>' +
    '<path class="route-base" d="' + routeD + '"/>' + segHtml +
    '<text class="sea-label" x="100" y="372" text-anchor="middle">البحر الأحمر</text>' +
    '<text class="sea-label" x="' + (proj(52.4, 27.8).x + 34) + '" y="' + proj(52.4, 27.8).y + '" text-anchor="middle">الخليج العربي</text>';
  var segEls = svg.querySelectorAll(".route-seg");

  var wrap = $("mapwrap"), bot = $("mapbot"), nodes = [];
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  pts.forEach(function(p, i){
    var n = document.createElement("div");
    n.className = "node upcoming";
    n.style.left = (p.x / W * 100) + "%";
    n.style.top  = (p.y / H * 100) + "%";
    n.innerHTML = String(i + 1) + '<span class="lab' + (STOPS[i].side ? " " + STOPS[i].side : "") + '">' + (STOPS[i].label || STOPS[i].name) + '</span>';
    wrap.insertBefore(n, bot);
    nodes.push(n);
  });

  function placeBot(i, animate){
    var ease = TRAVEL + "ms cubic-bezier(.55,.05,.3,1)";
    bot.style.transition = animate ? ("left " + ease + ", top " + ease + ", transform .7s ease") : "none";
    bot.style.setProperty("--tx", STOPS[i].tx || "-55%");
    bot.style.setProperty("--ty", STOPS[i].ty || "calc(-100% - 12px)");
    bot.style.left = (pts[i].x / W * 100) + "%";
    bot.style.top  = (pts[i].y / H * 100) + "%";
  }
  // stations 0..doneCount-1 are done, station cur (or none if -1) is the current one
  function paintNodes(doneCount, cur){
    nodes.forEach(function(n, i){
      var state = i < doneCount ? "done" : (i === cur ? "current" : "upcoming");
      n.className = "node " + state;
      var lab = n.querySelector(".lab");
      n.innerHTML = (state === "done" ? CHECK : String(i + 1));
      n.appendChild(lab);
    });
  }
  function paintSegs(upTo){
    Array.prototype.forEach.call(segEls, function(el, k){
      el.style.transition = "none";
      el.style.strokeDashoffset = k < upTo ? "0" : "1.01";
    });
  }
  function renderSegs(el, done, cur){
    var h = "";
    for (var k = 0; k < N; k++) h += '<span class="' + (k < done ? "done" : (k === cur ? "cur" : "")) + '"></span>';
    el.innerHTML = h;
  }

  /* ---------- state ---------- */
  var S = { qi: 0, team: false, players: [], go: "first", busy: false, qStart: 0 };

  function show(id){
    Object.keys(screens).forEach(function(k){ screens[k].classList.toggle("active", k === id); });
    document.documentElement.classList.toggle("green", id === "start" || id === "end");
    screens[id].scrollTop = 0;
  }
  function anim(el, cls, ms){
    el.classList.remove("cheer", "oops");
    void el.offsetWidth;
    el.classList.add(cls);
    setTimeout(function(){ el.classList.remove(cls); }, ms);
  }
  function turnOf(qi){ return S.team ? qi % 2 : 0; }
  function fmt(ms){
    var s = Math.floor(ms / 1000), m = Math.floor(s / 60), r = s % 60;
    return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
  }

  /* ---------- setup (mode + names) ---------- */
  function openSetup(){
    $("stepMode").hidden = false; $("stepNames").hidden = true;
    $("setupHead").textContent = "اختر طريقة اللعب";
    $("fields").innerHTML = "";
    show("setup");
  }
  function chooseMode(team){
    S.team = team;
    var labels = team ? ORD : ["أدخل اسمك"];
    $("setupHead").textContent = team ? "أدخل أسماء اللاعبين" : "لعب فردي";
    $("fields").innerHTML = labels.map(function(l, k){
      return '<label class="field"><span>' + l + '</span><input type="text" maxlength="20" autocomplete="off" data-k="' + k + '" placeholder="أدخل الاسم"></label>';
    }).join("");
    $("stepMode").hidden = true; $("stepNames").hidden = false;
    $("beginBtn").disabled = true;
    var inputs = $("fields").querySelectorAll("input");
    Array.prototype.forEach.call(inputs, function(inp){
      inp.addEventListener("input", validate);
      inp.addEventListener("keydown", function(e){ if (e.key === "Enter" && !$("beginBtn").disabled) $("beginBtn").click(); });
    });
    if (inputs[0]) inputs[0].focus({ preventScroll: true });
  }
  function validate(){
    var ok = true;
    Array.prototype.forEach.call($("fields").querySelectorAll("input"), function(inp){ if (!inp.value.trim()) ok = false; });
    $("beginBtn").disabled = !ok;
  }
  function beginGame(){
    S.players = Array.prototype.map.call($("fields").querySelectorAll("input"), function(inp){ return { name: inp.value.trim(), time: 0 }; });
    openMapFirst();
  }

  /* ---------- flow ---------- */
  function resetRun(){
    S.qi = 0; S.go = "first"; S.busy = false;
    S.players.forEach(function(p){ p.time = 0; });
    $("endbot").classList.remove("party");
    $("fx").innerHTML = "";
  }
  function turnHtml(qi){
    return S.team ? ' — <b>دور ' + ORD[turnOf(qi)] + '</b>' : "";
  }
  function openMapFirst(){
    resetRun();
    paintNodes(0, 0); paintSegs(0); placeBot(0, false);
    bot.classList.remove("moving", "arrive");
    $("mapPill").textContent = "نقطة البداية";
    renderSegs($("mapSegs"), 0, -1);
    $("mapStatus").innerHTML = "الروبوت جاهز للانطلاق من <b>" + STOPS[0].name + "</b>" + turnHtml(0);
    var b = $("goBtn"); b.disabled = false; b.style.visibility = "visible"; b.textContent = "انتقال إلى المرحلة الأولى";
    show("map");
    b.focus({ preventScroll: true });
  }
  function travel(target, done){
    S.busy = true;
    var from = pts[target - 1], to = pts[target];
    bot.style.setProperty("--lean", (to.x >= from.x ? 7 : -7) + "deg");
    bot.classList.remove("arrive"); bot.classList.add("moving");
    var seg = segEls[target - 1];
    seg.style.transition = "stroke-dashoffset " + TRAVEL + "ms cubic-bezier(.55,.05,.3,1)";
    seg.style.strokeDashoffset = "0";
    placeBot(target, true);
    paintNodes(target, target);
    $("mapPill").textContent = "المحطة " + (target + 1) + " من " + N;
    renderSegs($("mapSegs"), target, target);
    $("mapStatus").innerHTML = "الروبوت في طريقه إلى <b>" + STOPS[target].name + "</b>";
    setTimeout(function(){
      bot.classList.remove("moving"); bot.classList.add("arrive");
      $("mapStatus").innerHTML = "وصل الروبوت إلى <b>" + STOPS[target].name + "</b>" + turnHtml(target);
      S.busy = false;
      done();
    }, TRAVEL + 80);
  }
  function openMapAfter(qi){ // station qi is finished -> travel to station qi+1
    var target = qi + 1;
    paintNodes(target, -1); paintSegs(target - 1); placeBot(target - 1, false);
    bot.classList.remove("moving", "arrive");
    $("mapPill").textContent = "المحطة " + target + " من " + N;
    renderSegs($("mapSegs"), target, -1);
    $("mapStatus").innerHTML = "أنهينا المحطة " + target + "، لننطلق إلى <b>" + STOPS[target].name + "</b>";
    var b = $("goBtn"); b.style.visibility = "hidden"; b.disabled = true;
    show("map");
    setTimeout(function(){
      travel(target, function(){
        b.textContent = "انتقال إلى المرحلة التالية"; b.style.visibility = "visible"; b.disabled = false;
        S.go = "next"; b.focus({ preventScroll: true });
      });
    }, REDUCED ? 200 : 700);
  }

  function shuffle(a){
    for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var LETTERS = ["أ", "ب", "ج", "د"];
  function openQuestion(qi){
    S.qi = qi;
    var Q = QUESTIONS[qi];
    $("quizPill").textContent = "المحطة " + (qi + 1) + " من " + N;
    renderSegs($("quizSegs"), qi, qi);
    $("qn").textContent = String(qi + 1);
    $("qcity").textContent = STOPS[qi].name;
    var turn = $("turn");
    if (S.team){
      var pl = turnOf(qi);
      turn.innerHTML = '<i>' + (pl + 1) + '</i>دور ' + ORD[pl] + ': <b></b>';
      turn.querySelector("b").textContent = S.players[pl].name;
      turn.hidden = false;
    } else { turn.hidden = true; }
    $("qtext").textContent = Q.q;
    var items = shuffle(Q.a.map(function(t, k){ return { t: t, ok: k === 0 }; }));
    var box = $("answers"); box.innerHTML = "";
    items.forEach(function(it, k){
      var b = document.createElement("button");
      b.type = "button"; b.className = "ans";
      b.innerHTML = '<span class="k">' + LETTERS[k] + '</span><span></span>';
      b.lastChild.textContent = it.t;
      b.addEventListener("click", function(){ answer(b, it, items, box); });
      box.appendChild(b);
    });
    $("fb").className = "fb";
    $("nextBtn").hidden = true;
    $("nextBtn").textContent = qi === N - 1 ? "إنهاء الرحلة" : "تابع الرحلة";
    show("quiz");
    S.qStart = performance.now();
  }
  function attemptsText(n){
    if (n === 1) return "لديك محاولة واحدة متبقية.";
    if (n === 2) return "لديك محاولتان متبقيتان.";
    return "لديك " + n + " محاولات متبقية.";
  }
  function answer(btn, it, items, box){
    var qi = S.qi, Q = QUESTIONS[qi];
    var all = box.querySelectorAll(".ans");
    var fb = $("fb");
    if (it.ok){
      S.players[turnOf(qi)].time += performance.now() - S.qStart;
      Array.prototype.forEach.call(all, function(b, k){
        b.disabled = true;
        if (items[k].ok) b.classList.add("correct");
        else if (!b.classList.contains("locked")) b.classList.add("dim");
      });
      btn.querySelector(".k").textContent = "✓";
      fb.className = "fb ok show";
      $("fbTitle").textContent = "أحسنت! ✓";
      $("fbSub").style.display = "none";
      $("fbInfo").textContent = Q.info;
      $("nextBtn").hidden = false;
      anim($("qbot"), "cheer", 1000);
      burst($("qbot"));
      setTimeout(function(){ fb.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "nearest" }); $("nextBtn").focus({ preventScroll: true }); }, 120);
    } else {
      btn.disabled = true;
      btn.classList.add("locked");
      btn.querySelector(".k").textContent = "✕";
      var left = box.querySelectorAll(".ans:not([disabled])").length;
      fb.className = "fb"; void fb.offsetWidth; fb.className = "fb no show";
      $("fbTitle").textContent = "حاول مرة أخرى!";
      $("fbSub").style.display = "";
      $("fbSub").textContent = attemptsText(left);
      $("fbInfo").textContent = "";
      $("nextBtn").hidden = true;
      anim($("qbot"), "oops", 850);
      setTimeout(function(){ fb.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "nearest" }); }, 120);
    }
  }

  function row(name, time, win, label){
    var d = document.createElement("div");
    d.className = "res" + (win ? " win" : "");
    var l = document.createElement("div");
    var nm = document.createElement("span"); nm.textContent = name;
    var sm = document.createElement("small"); sm.textContent = label;
    l.appendChild(nm); l.appendChild(sm);
    var b = document.createElement("b"); b.setAttribute("dir", "ltr"); b.textContent = fmt(time);
    d.appendChild(l); d.appendChild(b);
    return d;
  }
  function openEnd(){
    var res = $("endResults"), v = $("verdict");
    res.innerHTML = ""; v.hidden = true;
    if (S.team){
      $("endTitle").innerHTML = "أحسنتما!<br>لقد أكملتما الرحلة بنجاح 🎉";
      var a = S.players[0], b = S.players[1];
      var tie = Math.floor(a.time / 1000) === Math.floor(b.time / 1000);
      var aWin = !tie && a.time < b.time, bWin = !tie && b.time < a.time;
      res.appendChild(row(a.name, a.time, aWin, "وقت إكمال الأسئلة"));
      res.appendChild(row(b.name, b.time, bWin, "وقت إكمال الأسئلة"));
      v.textContent = tie ? "تعادل بينكما في الوقت 🤝" : ("الأسرع: " + (aWin ? a.name : b.name) + " 🏆");
      v.hidden = false;
    } else {
      $("endTitle").innerHTML = "أحسنت!<br>لقد أكملت رحلتك بنجاح!";
      res.appendChild(row(S.players[0].name, S.players[0].time, false, "وقت إكمال الرحلة"));
    }
    show("end");
    $("endbot").classList.add("party");
    if (!REDUCED) rain();
  }

  /* ---------- confetti ---------- */
  var COLORS_LIGHT = ["#FFFFFF", "#D8C7A3", "#C9B28C", "#59C98C", "#9BE0BB"];
  var COLORS_MIX = ["#006C35", "#0B5D3B", "#D8C7A3", "#C9B28C", "#59C98C"];
  function piece(colors){
    var c = document.createElement("span"); c.className = "cf";
    var w = 6 + Math.random() * 8;
    c.style.width = w + "px"; c.style.height = (w * (0.5 + Math.random() * 1.1)) + "px";
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    return c;
  }
  function burst(target){
    if (REDUCED) return;
    var r = target.getBoundingClientRect();
    var cx = r.left + r.width * 0.55, cy = r.top + r.height * 0.3, fx = $("fx");
    for (var i = 0; i < 26; i++){
      var c = piece(COLORS_MIX); var a = Math.random() * Math.PI * 2, d = 70 + Math.random() * 130;
      c.style.left = cx + "px"; c.style.top = cy + "px";
      c.style.setProperty("--dx", Math.cos(a) * d + "px");
      c.style.setProperty("--dy", (Math.sin(a) * d - 40) + "px");
      c.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
      c.style.animation = "burst " + (0.9 + Math.random() * 0.5) + "s cubic-bezier(.2,.7,.3,1) forwards";
      fx.appendChild(c); (function(el){ setTimeout(function(){ el.remove(); }, 1600); })(c);
    }
  }
  function rain(){
    var fx = $("fx");
    for (var i = 0; i < 56; i++){
      var c = piece(COLORS_LIGHT);
      c.style.left = (Math.random() * 100) + "vw"; c.style.top = "0";
      c.style.setProperty("--dx", (Math.random() * 160 - 80) + "px");
      c.style.setProperty("--rot", (Math.random() * 900 - 450) + "deg");
      c.style.animation = "fall " + (2.8 + Math.random() * 2.6) + "s linear " + (Math.random() * 1.6) + "s forwards";
      fx.appendChild(c); (function(el){ setTimeout(function(){ el.remove(); }, 8000); })(c);
    }
  }

  /* ---------- events ---------- */
  $("playBtn").addEventListener("click", openSetup);
  $("soloBtn").addEventListener("click", function(){ chooseMode(false); });
  $("teamBtn").addEventListener("click", function(){ chooseMode(true); });
  $("backBtn").addEventListener("click", openSetup);
  $("beginBtn").addEventListener("click", beginGame);
  $("goBtn").addEventListener("click", function(){
    if (S.busy) return;
    if (S.go === "first") openQuestion(0); else openQuestion(S.qi + 1);
  });
  $("nextBtn").addEventListener("click", function(){
    if (S.qi < N - 1) openMapAfter(S.qi); else openEnd();
  });
  $("replayBtn").addEventListener("click", openMapFirst);
  $("homeBtn").addEventListener("click", function(){ resetRun(); S.players = []; show("start"); });

  document.documentElement.classList.add("green");
  paintNodes(0, 0); paintSegs(0); placeBot(0, false);
})();
