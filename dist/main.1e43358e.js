// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"src/main.js":[function(require,module,exports) {
document.addEventListener("DOMContentLoaded", function () {
  phaserGame();
  gameBox = document.getElementsByTagName("canvas")[0];
  gameBox.setAttribute("id", "game-box");
  scoreBox = document.createElement("span");
  scoreBox.style.visibility = "hidden";
  scoreBox.setAttribute("id", "score-box");
  gameBox.append(scoreBox);
});

function phaserGame() {
  var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 700,
    parent: "game",
    // backgroundColor: '#0072bc',
    physics: {
      default: 'arcade'
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  var image;
  var player;
  var cursors;
  var game = new Phaser.Game(config);
  var scoreText;
  var score = 0;
  var bones; // console.log(scoreList)

  function preload() {
    this.load.image('bone', 'dist/assets/image/bone.png');
    this.load.image('mailman', 'dist/assets/image/mailman.png');
    this.load.spritesheet('shiba_down', 'dist/assets/sprite/shibaInu-0.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('shiba_up', 'dist/assets/sprite/shibaInu-2.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('shiba_left', 'dist/assets/sprite/shibaInu-3.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('shiba_right', 'dist/assets/sprite/shibaInu-1.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet('shiba_turn', 'dist/assets/sprite/shibaInu-4.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.image("overworld", "dist/assets/tile/overworld.png");
    this.load.image("objects", "dist/assets/tile/objects.png");
    this.load.tilemapTiledJSON('map', 'dist/assets/tile/phaser-proj.json');
  }

  function create() {
    var map = this.make.tilemap({
      key: "map"
    });
    var tileset = map.addTilesetImage("overworld", "overworld");
    var groundLayer = map.createStaticLayer("ground", tileset, 0, 0);
    var worldLayer = map.createStaticLayer("world", tileset, 0, 0);
    worldLayer.setCollisionByProperty({
      collides: true
    });
    player = this.physics.add.sprite(200, 200, "shiba_turn");
    player.setCollideWorldBounds(true);
    scoreText = this.add.text(16, 16, "Score: ".concat(score), {
      fontSize: '32px',
      fill: '#000'
    });
    this.anims.create({
      key: 'turn',
      frames: [{
        key: 'shiba_turn',
        frame: 0
      }],
      frameRate: 1,
      repeat: 1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('shiba_right', {
        start: 1,
        end: 3
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('shiba_left', {
        start: 1,
        end: 2
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('shiba_up', {
        start: 1,
        end: 2
      }),
      frameRate: 8,
      repeat: -1
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('shiba_down', {
        start: 1,
        end: 2
      }),
      frameRate: 8,
      repeat: -1
    });
    cursors = this.input.keyboard.createCursorKeys();
    this.bones = this.game.add.physicsGroup();
    bones = map.createFromObjects('objects', 1574, {
      key: 'bone'
    }, this.bones); // this.bones = this.game.add.physicsGroup(); // step 1
    // this.map.createFromObjects('objects', 'bone', 'objects', 1574, true, false, this.bones); // step 2
    // step 3
    // this.bones.forEach(function(bone){
    //     bone.body.immovable = true;
    // });    

    this.physics.add.overlap(player, bones, collectBone, null, this);
    mailman = this.physics.add.image(300, 300, 'mailman');
    this.physics.add.collider(player, mailman, hitMailman, null, this);
    this.physics.add.collider(player, worldLayer);
  }

  function update() {
    player.setVelocity(0);

    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(500);
      player.anims.play('right', true);
    }

    if (cursors.up.isDown) {
      player.setVelocityY(-160);
      player.anims.play('up', true);
    } else if (cursors.down.isDown) {
      player.setVelocityY(160);
      player.anims.play('down', true);
    }
  }

  function collectBone(player, bone) {
    bone.disableBody(true, true);
    score += 10;
    scoreText.setText("Score: ".concat(score));
  }

  function hitMailman(player, mailman) {
    scoreBox = Phaser.DOM.AddToDOM(document.getElementById("score-box"));
    scoreBox.innerText = score;
    fetch("http://localhost:3000", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "score": score
      })
    }); // can = Phaser.DOM.AddToDOM(document.getElementsByTagName("canvas"))
    // console.log(can)

    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
  }
}
},{}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "46855" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/main.js"], null)
//# sourceMappingURL=/main.1e43358e.map