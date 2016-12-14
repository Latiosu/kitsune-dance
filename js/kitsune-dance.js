var width = 640;
var height = 360;
var config = {
  'width': width,
  'height': height,
  'renderer': Phaser.AUTO,
  'parent': 'game',
  'resolution': window.devicePixelRatio,
  'state': { preload: preload, create: create, update: update, render: render }
}
var game = new Phaser.Game(config);

var ui = new Map();
var graphics;
var input;
var actions;
var score;
var judgement;

var bpm = bpm = 107;
var tempo = (60 / bpm) * 1000;
var songOffset = -40 + (8 * tempo);
var currentTime = 0;

var isPaused = false;
var state = 'ready-screen';
var actionIndex = 0;
var chicken;
var music;

function preload() {
  game.forceSingleUpdate = true;

  var style = { font: 'bold 32px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' };
  var loadingText = game.add.text(0, 0, 'Loading ...', style);
  loadingText.setTextBounds(0, 0, width, height);
  ui.set('loadingText', loadingText);

  game.load.atlasJSONHash('chicken', 'assets/chicken-atlas.png', 'assets/chicken-atlas.json');
  game.load.audio('24k-magic', ['assets/24k-magic.ogg', 'assets/24k-magic.mp3']);
  game.load.image('pulse', 'assets/pulse.png');
}

function create() {
  // Primary components
  game.stage.disableVisibilityChange = true;
  game.stage.backgroundColor = '#f1ce78';
  graphics = game.add.graphics(0, 0);
  music = game.add.audio('24k-magic');

  // Manually created arrow sequence
  actions = new Array();
  actions.push(new Action(beat(0), 'left'));
  actions.push(new Action(beat(2), 'right'));
  actions.push(new Action(beat(4), 'up'));
  actions.push(new Action(beat(6), 'down'));

  actions.push(new Action(beat(8), 'left'));
  actions.push(new Action(beat(9), 'left'));
  actions.push(new Action(beat(10), 'left'));
  actions.push(new Action(beat(12), 'right'));
  actions.push(new Action(beat(13), 'right'));
  actions.push(new Action(beat(14), 'right'));

  actions.push(new Action(beat(16), 'down'));
  actions.push(new Action(beat(16), 'up'));
  actions.push(new Action(beat(18), 'left'));
  actions.push(new Action(beat(18), 'right'));

  actions.push(new Action(beat(20), 'up'));
  actions.push(new Action(beat(21), 'up'));
  actions.push(new Action(beat(22), 'down'));
  actions.push(new Action(beat(24), 'down'));
  actions.push(new Action(beat(25), 'down'));
  actions.push(new Action(beat(26), 'up'));

  actions.push(new Action(beat(28), 'up'));
  actions.push(new Action(beat(28), 'left'));
  actions.push(new Action(beat(30), 'up'));
  actions.push(new Action(beat(30), 'right'));

  actions.push(new Action(beat(32), 'right'));
  actions.push(new Action(beat(33), 'left'));
  actions.push(new Action(beat(34), 'right'));
  actions.push(new Action(beat(34), 'left'));

  actions.push(new Action(beat(36), 'up'));
  actions.push(new Action(beat(36.5), 'left'));
  actions.push(new Action(beat(37), 'up'));
  actions.push(new Action(beat(38), 'down'));
  actions.push(new Action(beat(38.5), 'right'));
  actions.push(new Action(beat(39), 'down'));
  actions.push(new Action(beat(40), 'left'));
  actions.push(new Action(beat(40.5), 'left'));
  actions.push(new Action(beat(41), 'right'));
  actions.push(new Action(beat(41.5), 'right'));
  actions.push(new Action(beat(42), 'up'));
  actions.push(new Action(beat(42.5), 'up'));
  actions.push(new Action(beat(43), 'left'));
  actions.push(new Action(beat(43.5), 'down'));
  actions.push(new Action(beat(44), 'right'));
  actions.push(new Action(beat(44.5), 'down'));
  actions.push(new Action(beat(45), 'left'));
  actions.push(new Action(beat(45.5), 'up'));
  actions.push(new Action(beat(46), 'down'));

  actions.push(new Action(beat(48), 'left'));
  actions.push(new Action(beat(48.5), 'right'));
  actions.push(new Action(beat(49), 'up'));

  actions.push(new Action(beat(50), 'right'));
  actions.push(new Action(beat(50.5), 'left'));
  actions.push(new Action(beat(51), 'down'));

  actions.push(new Action(beat(52), 'left'));
  actions.push(new Action(beat(52.5), 'down'));
  actions.push(new Action(beat(53), 'left'));
  actions.push(new Action(beat(53.5), 'up'));
  actions.push(new Action(beat(54), 'left'));

  actions.push(new Action(beat(56), 'down'));
  actions.push(new Action(beat(56.5), 'down'));
  actions.push(new Action(beat(57), 'up'));
  actions.push(new Action(beat(57.5), 'right'));
  actions.push(new Action(beat(58), 'down'));
  actions.push(new Action(beat(58.5), 'down'));
  actions.push(new Action(beat(59), 'left'));
  actions.push(new Action(beat(59.5), 'up'));

  actions.push(new Action(beat(60), 'right'));
  actions.push(new Action(beat(60.5), 'down'));
  actions.push(new Action(beat(61), 'left'));
  actions.push(new Action(beat(61.5), 'up'));
  actions.push(new Action(beat(62), 'left'));
  actions.push(new Action(beat(62), 'right'));

  actions.push(new Action(beat(63), 'up'));
  actions.push(new Action(beat(64), 'down'));
  actions.push(new Action(beat(65), 'left'));
  actions.push(new Action(beat(66), 'right'));
  actions.push(new Action(beat(67), 'up'));

  actions.push(new Action(beat(68), 'right'));
  actions.push(new Action(beat(68.5), 'right'));
  actions.push(new Action(beat(69), 'right'));

  actions.push(new Action(beat(70), 'left'));
  actions.push(new Action(beat(70.5), 'left'));
  actions.push(new Action(beat(71), 'left'));

  actions.push(new Action(beat(72), 'down'));
  actions.push(new Action(beat(73), 'up'));
  actions.push(new Action(beat(74), 'right'));
  actions.push(new Action(beat(75), 'left'));
  actions.push(new Action(beat(76), 'down'));

  actions.push(new Action(beat(77), 'left'));
  actions.push(new Action(beat(77.5), 'left'));
  actions.push(new Action(beat(78), 'left'));

  actions.push(new Action(beat(79), 'right'));
  actions.push(new Action(beat(79.5), 'right'));
  actions.push(new Action(beat(80), 'right'));

  actions.push(new Action(beat(81), 'up'));
  actions.push(new Action(beat(82), 'up'));
  actions.push(new Action(beat(83), 'down'));

  actions.push(new Action(beat(84), 'left'));
  actions.push(new Action(beat(84.5), 'down'));
  actions.push(new Action(beat(85), 'left'));
  actions.push(new Action(beat(86), 'right'));
  actions.push(new Action(beat(86.5), 'down'));
  actions.push(new Action(beat(87), 'right'));

  actions.push(new Action(beat(88), 'up'));
  actions.push(new Action(beat(89), 'left'));
  actions.push(new Action(beat(90), 'right'));
  actions.push(new Action(beat(91), 'up'));

  actions.push(new Action(beat(92), 'up'));
  actions.push(new Action(beat(92.25), 'up'));
  actions.push(new Action(beat(93), 'left'));
  actions.push(new Action(beat(93.25), 'left'));
  actions.push(new Action(beat(94), 'right'));
  actions.push(new Action(beat(94.25), 'right'));
  actions.push(new Action(beat(95), 'down'));
  actions.push(new Action(beat(95.25), 'down'));

  actions.push(new Action(beat(96), 'left'));
  actions.push(new Action(beat(96), 'right'));

  // -- repeat

  actions.push(new Action(beat(97), 'left'));
  actions.push(new Action(beat(98), 'right'));
  actions.push(new Action(beat(99), 'up'));
  actions.push(new Action(beat(100), 'down'));

  actions.push(new Action(beat(101), 'left'));
  actions.push(new Action(beat(101.5), 'left'));
  actions.push(new Action(beat(102), 'left'));
  actions.push(new Action(beat(103), 'right'));
  actions.push(new Action(beat(103.5), 'right'));
  actions.push(new Action(beat(104), 'right'));

  actions.push(new Action(beat(105), 'left'));
  actions.push(new Action(beat(106), 'left'));
  actions.push(new Action(beat(107), 'left'));
  actions.push(new Action(beat(108), 'right'));

  actions.push(new Action(beat(109), 'left'));
  actions.push(new Action(beat(110), 'left'));
  actions.push(new Action(beat(111), 'left'));
  actions.push(new Action(beat(112), 'left'));

  actions.push(new Action(beat(113), 'right'));
  actions.push(new Action(beat(114), 'right'));
  actions.push(new Action(beat(115), 'right'));
  actions.push(new Action(beat(116), 'right'));

  actions.push(new Action(beat(117), 'up'));
  actions.push(new Action(beat(118), 'up'));
  actions.push(new Action(beat(119), 'up'));
  actions.push(new Action(beat(120), 'up'));

  actions.push(new Action(beat(121), 'up'));
  actions.push(new Action(beat(122), 'up'));
  actions.push(new Action(beat(123), 'up'));
  actions.push(new Action(beat(124), 'left'));
  actions.push(new Action(beat(124), 'right'));

  // End arrow sequence


  input = game.input.keyboard.addKeys(
    {'up': Phaser.KeyCode.UP,
    'down': Phaser.KeyCode.DOWN,
    'left': Phaser.KeyCode.LEFT,
    'right': Phaser.KeyCode.RIGHT,
    'select': Phaser.KeyCode.SPACEBAR,
    'pause': Phaser.KeyCode.ESC
  });
  // Capture default browser action
  game.input.keyboard.addKeyCapture([
    Phaser.KeyCode.UP,
    Phaser.KeyCode.DOWN,
    Phaser.KeyCode.LEFT,
    Phaser.KeyCode.RIGHT,
    Phaser.KeyCode.SPACEBAR,
    Phaser.KeyCode.ESC
  ]);

  input.pause.onDown.add(pauseGame, this);

  ui.get('loadingText').destroy();

  var style = { font: 'bold 32px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' };
  var readyText = game.add.text(0, 0, 'Hit space to start', style);
  readyText.setTextBounds(0, 0, width, height);
  ui.set('readyText', readyText);
}

function update() {
  if (state == 'ready-screen' && input.select.isDown) {
    // Remove pause text
    ui.get('readyText').destroy();
    ui.delete('readyText');

    // Add score text
    score = new Score();
    var style = { font: 'bold 24px Arial', fill: '#fff', boundsAlignH: 'right', boundsAlignV: 'middle' };
    var scoreText = game.add.text(0, 0, score.value, style);
    scoreText.setTextBounds(width - 320, 0, 300, 60);
    ui.set('scoreText', scoreText);

    // Add combo text
    var style = { font: 'bold 24px Arial', fill: '#fff', boundsAlignH: 'left', boundsAlignV: 'middle' };
    var comboText = game.add.text(0, 0, '', style);
    comboText.setTextBounds(15, 0, 300, 60);
    ui.set('comboText', comboText);

    // Add judgement text
    style = { font: 'bold 24px Arial', fill: '#fff', boundsAlignH: 'middle', boundsAlignV: 'middle' };
    judgement = game.add.text(game.world.centerX - 25, height - 50, "", style);
    judgement.alpha = 0;

    // Add chicken player
    chicken = game.add.sprite(width/2 - 38, height/2 - 48, 'chicken', '0.png');
    chicken.scale.setTo(0.25, 0.25);
    chicken.animations.add('idle', ['0.png', '1.png'], bpm / 60, true, false);
    chicken.animations.play('idle');

    music.volume = 0.5;
    music.play();

    state = 'game-screen';
    console.log('Going to game screen');
  } else if (state == 'game-screen') {
    currentTime += game.time.elapsed;

    // Get upcoming arrow
    var action = actions[actionIndex];
    if (actionIndex >= actions.length) {
      // TODO -- Go to score screen after delay
      state = 'score-screen';
      console.log('Going to score screen');
    } else {
      var diff = action.time - currentTime;
      var absDiff = Math.abs(diff);

      // Timing windows
      if (diff <= -150 - height/8) { // Miss
        actionIndex++;
        action.isHit = true;
        judgement.text = "Miss";
        judgement.alpha = 1;
        judgement.fill = "#FF0000";
        game.add.tween(judgement).to({alpha: 0}, 1500, "Linear", true);
        score.add('miss');
      } else if (absDiff < 40 && checkArrowInput(action.arrow)) { // Perfect
        actionIndex++;
        action.isHit = true;
        judgement.text = "Perfect";
        judgement.alpha = 1;
        judgement.fill = "#FFFF45"
        game.add.tween(judgement).to({alpha: 0}, 1500, "Linear", true);
        // game.add.tween(pulse).to({alpha: 0}, 1000, "Linear", true);
        score.add('perfect');
      } else if (absDiff < 90 && checkArrowInput(action.arrow)) { // Great
        actionIndex++;
        action.isHit = true;
        judgement.text = "Great";
        judgement.alpha = 1;
        judgement.fill = "#62F249";
        game.add.tween(judgement).to({alpha: 0}, 1500, "Linear", true);
        // game.add.tween(pulse).to({alpha: 0}, 1000, "Linear", true);
        score.add('great');
      } else if (absDiff < 150 && checkArrowInput(action.arrow)) { // Ok
        actionIndex++;
        action.isHit = true;
        judgement.text = "Ok";
        judgement.alpha = 1;
        judgement.fill = "#61F7FF";
        game.add.tween(judgement).to({alpha: 0}, 1500, "Linear", true);
        score.add('ok');
      } else {
        // Do nothing
      }
    }
  } else if (state == 'score-screen') {

  }
}

function render() {
  graphics.clear();
  if (state == 'game-screen') {
    // Render player position
    graphics.beginFill(0xFFFFFF);
    graphics.fillAlpha = 0.5;
    graphics.drawCircle(width/2, height/2, height/8);
    graphics.endFill();

    // Render falling arrows
    graphics.beginFill(0xF78C11);
    for (var i = 0; i < actions.length; i++) {
      var a = actions[i];
      var pos = (currentTime - a.time)/4;
      if (pos > 80 || a.isHit) {
        // Don't render missed arrows
        continue;
      } else if (pos > 0) {
        // Fade out late arrows
        graphics.fillAlpha = 1 - pos / 80;
      } else {
        // Stay solid until at player
        graphics.fillAlpha = 1.0;
      }

      // Reposition circle based on direction
      if (a.arrow == 'up') {
        graphics.drawCircle(width/2, pos + height/2, height/8);
      } else if (a.arrow == 'left') {
        graphics.drawCircle(pos + 140 + height/2, height/2, height/8);
      } else if (a.arrow == 'down') {
        graphics.drawCircle(width/2, -pos + height/2, height/8);
      } else if (a.arrow == 'right') {
        graphics.drawCircle(-pos + height/2 + 140, height/2, height/8);
      }
    }
    graphics.endFill();
  }
}

function checkArrowInput(arrow) {
  if (arrow == 'up' && input.up.downDuration(200)) {
    return true;
  } else if (arrow == 'left' && input.left.downDuration(200)) {
    return true;
  } else if (arrow == 'down' && input.down.downDuration(200)) {
    return true;
  } else if (arrow == 'right' && input.right.downDuration(200)) {
    return true;
  }
  return false;
}

function pauseGame() {
  if (game.paused) {
    pauseLabel.destroy();
    music.resume();
  } else {
    pauseLabel = game.add.text(width/2, height/2, 'Hit ESC to continue', { font: 'bold 32px Arial', fill: '#fff' });
    pauseLabel.anchor.setTo(0.5, 0.5);
    music.pause();
  }
  game.paused = !game.paused;
}

function beat(number) {
  return number * tempo + songOffset;
}

function Action(time, arrow) {
  this.time = time;
  this.arrow = arrow;
  this.isHit = false;
}

function Score() {
  this.value = 0;
  this.combo = 0;
  this.maxCombo = 0;
  this.miss = 0;
  this.ok = 0;
  this.great = 0;
  this.perfect = 0;
  this.add = function(type) {
    // Check if missed
    if (type == 'miss') {
      this.combo = 0;
      this.miss += 1;
    } else {
      // Update combo
      this.combo += 1;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }

      // Resolve accuracy type
      if (type == 'ok') {
        this.ok += 1;
        this.value += 100;
      } else if (type == 'great') {
        this.great += 1;
        this.value += 500;
      } else if (type == 'perfect') {
        this.perfect += 1;
        this.value += 1500;
      }
    }
    ui.get('scoreText').text = this.value;
    if (this.combo >= 5) {
      ui.get('comboText').text = this.combo + ' combo';
    } else {
      ui.get('comboText').text = '';
    }
  };
}
