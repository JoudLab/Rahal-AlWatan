/* Sound effects: five short clips in assets/audio/ played through the Web Audio API,
   with an HTMLAudio fallback. Nothing plays before the first user interaction.
   To replace a sound, drop a file with the same name into assets/audio/. */
(function(){
  "use strict";
  var BASE = "assets/audio/";
  var FILES = { correct: "correct.mp3", wrong: "wrong.mp3", transition: "transition.mp3", station: "station.mp3", victory: "victory.mp3" };
  var KEY = "rahal-al-watan:sound";
  var Ctx = window.AudioContext || window.webkitAudioContext;
  var btn = document.getElementById("soundBtn");
  var muted = false, started = false, ctx = null, master = null;
  var buffers = {}, els = {}, missing = {};

  try { muted = localStorage.getItem(KEY) === "off"; } catch (e) {}

  function paint(){
    if (!btn) return;
    btn.classList.toggle("off", muted);
    btn.setAttribute("aria-pressed", muted ? "false" : "true");
    btn.setAttribute("aria-label", muted ? "تشغيل الصوت" : "كتم الصوت");
    btn.title = muted ? "تشغيل الصوت" : "كتم الصوت";
  }
  function save(){ try { localStorage.setItem(KEY, muted ? "off" : "on"); } catch (e) {} }

  function fallback(name, url){
    var a = new Audio();
    a.preload = "auto";
    a.addEventListener("error", function(){ missing[name] = true; });
    a.src = url;
    els[name] = a;
  }
  function load(name){
    var url = BASE + FILES[name];
    if (ctx && window.fetch){
      fetch(url)
        .then(function(r){ if (!r.ok) throw new Error("missing"); return r.arrayBuffer(); })
        .then(function(ab){ return new Promise(function(res, rej){ ctx.decodeAudioData(ab, res, rej); }); })
        .then(function(buf){ buffers[name] = buf; })
        .catch(function(){ fallback(name, url); });
    } else {
      fallback(name, url);
    }
  }

  // Runs once, on the first real interaction (browsers block audio before that).
  function start(){
    if (started) return;
    started = true;
    ["pointerdown", "touchend", "click", "keydown"].forEach(function(ev){ document.removeEventListener(ev, start, true); });
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {}
    if (Ctx){
      try {
        ctx = new Ctx();
        master = ctx.createGain();
        master.gain.value = 0.9;
        master.connect(ctx.destination);
        if (ctx.resume) ctx.resume();
        var s = ctx.createBufferSource();          // silent tick: unlocks audio on iOS
        s.buffer = ctx.createBuffer(1, 1, 22050);
        s.connect(ctx.destination);
        s.start(0);
      } catch (e) { ctx = null; }
    }
    Object.keys(FILES).forEach(load);
  }
  ["pointerdown", "touchend", "click", "keydown"].forEach(function(ev){ document.addEventListener(ev, start, true); });

  function play(name){
    if (muted || !started || !FILES[name]) return;
    if (ctx){
      if (ctx.state !== "running" && ctx.resume) ctx.resume();
      var b = buffers[name];
      if (b){
        try { var src = ctx.createBufferSource(); src.buffer = b; src.connect(master); src.start(0); } catch (e) {}
        return;
      }
    }
    var a = els[name];
    if (a && !missing[name]){
      try { var c = a.cloneNode(); c.volume = 0.9; var p = c.play(); if (p && p.catch) p.catch(function(){}); } catch (e) {}
    }
  }

  if (btn){
    btn.addEventListener("click", function(){ muted = !muted; save(); paint(); });
    paint();
  }
  window.GameSound = { play: play, isMuted: function(){ return muted; } };
})();
