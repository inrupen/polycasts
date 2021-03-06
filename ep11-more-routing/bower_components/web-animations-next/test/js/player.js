/**
 * Copyright 2017 Google Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

suite('player', function() {
  setup(function() {
    webAnimationsMinifill.timeline._players = [];
  });
  test('zero duration animation works', function() {
    tick(90);
    var p = document.body.animate([], 0);
    tick(100);
    assert.equal(p.startTime, 100);
    assert.equal(p.currentTime, 0);
  });
  test('playing works as expected', function() {
    tick(90);
    var p = document.body.animate([], 2000);
    tick(100);
    assert.equal(p.startTime, 100);
    assert.equal(p.currentTime, 0);
    tick(300);
    assert.equal(p.startTime, 100);
    assert.equal(p.currentTime, 200);
  });
  test('pause at start of play', function() {
    tick(90);
    var p = document.body.animate([], 2000);
    p.pause();
    tick(100);
    assert.equal(p.currentTime, 0);
    tick(300);
    p.play();
    assert.equal(p.currentTime, 0);
    tick(310);
    assert.equal(p.currentTime, 0);
    assert.equal(p.startTime, 310);

    var p = document.body.animate([], 2000);
    p.startTime = -690;
    p.pause();
    assert.equal(p.currentTime, null);
    tick(700);
    p.play();
    tick(701);
    assert.equal(p.currentTime, 1000);
    tick(800);
    assert.equal(p.currentTime, 1099);
    assert.equal(p.startTime, -299);
  });
  test('pausing works as expected', function() {
    tick(190);
    var p = document.body.animate([], 3000);
    tick(200);
    tick(1500);
    assert.equal(p.startTime, 200);
    assert.equal(p.currentTime, 1300);
    p.pause();
    assert.equal(p.startTime, null);
    assert.equal(p.currentTime, null);
    tick(2500);
    assert.equal(p.startTime, null);
    assert.equal(p.currentTime, 1300);
    p.play();
    tick(2510);
    assert.equal(p.startTime, 1210);
    assert.equal(p.currentTime, 1300);
    tick(3500);
    assert.equal(p.startTime, 1210);
    assert.equal(p.currentTime, 2290);
  });
  test('reversing works as expected', function() {
    tick(290);
    var p = document.body.animate([], 1000);
    tick(300);
    assert.equal(p.startTime, 300);
    assert.equal(p.currentTime, 0);
    tick(600);
    assert.equal(p.startTime, 300);
    assert.equal(p.currentTime, 300);
    assert.equal(p.playbackRate, 1);
    p.reverse();
    tick(600);
    assert.equal(p.startTime, 900);
    assert.equal(p.currentTime, 300);
    assert.equal(p.playbackRate, -1);
    tick(700);
    assert.equal(p.startTime, 900);
    assert.equal(p.currentTime, 200);
  });
  test('reversing after pausing', function() {
    tick(90);
    var p = document.body.animate([], 1000);
    tick(100);
    tick(600);
    p.reverse();
    tick(601);
    tick(700);
    assert.equal(p.startTime, 1101);
    assert.equal(p.currentTime, 401);
  });
  test('reversing after finishing works as expected', function() {
    tick(90);
    var p = document.body.animate([], 1000);
    tick(100);
    tick(1200);
    assert.equal(p.finished, true);
    assert.equal(p.startTime, 100);
    assert.equal(p.currentTime, 1000);
    tick(1500);
    assert.equal(p.currentTime, 1000);
    assert.equal(isTicking(), false);
    p.reverse();
    assert.equal(p._startTime, null);
    assert.equal(p.currentTime, 1000);
    tick(1600);
    assert.equal(p.startTime, 2600);
    assert.equal(p.currentTime, 1000);
  });
  test('playing after finishing works as expected', function() {
    tick(90);
    var p = document.body.animate([], 1000);
    tick(100);
    tick(1200);
    assert.equal(p.finished, true);
    assert.equal(p.startTime, 100);
    assert.equal(p.currentTime, 1000);
    tick(1500);
    assert.equal(p.currentTime, 1000);
    assert.equal(isTicking(), false);
    p.play();
    assert.equal(p.startTime, null);
    assert.equal(p.currentTime, 0);
    tick(1600);
    assert.equal(p.startTime, 1600);
    assert.equal(p.currentTime, 0);
  });
  test('limiting works as expected', function() {
    tick(390);
    var p = document.body.animate([], 1000);
    tick(400);
    assert.equal(p.startTime, 400);
    assert.equal(p.currentTime, 0);
    tick(900);
    assert.equal(p.startTime, 400);
    assert.equal(p.currentTime, 500);
    tick(1400);
    assert.equal(p.startTime, 400);
    assert.equal(p.currentTime, 1000);
    tick(1500);
    assert.equal(p.startTime, 400);
    assert.equal(p.currentTime, 1000);
    p.reverse();
    assert.equal(p.playbackRate, -1);
    assert.equal(p.currentTime, 1000);
    assert.equal(p._startTime, null);
    tick(2000);
    assert.equal(p.currentTime, 1000);
    assert.equal(p.startTime, 3000);
    tick(2200);
    assert.equal(p.currentTime, 800);
    assert.equal(p.startTime, 3000);
    tick(3200);
    assert.equal(p.currentTime, 0);
    assert.equal(p.startTime, 3000);
    tick(3500);
    assert.equal(p.currentTime, 0);
    assert.equal(p.startTime, 3000);
  });
  test('play after limit works as expected', function() {
    tick(490);
    var p = document.body.animate([], 2000);
    tick(500);
    tick(2600);
    assert.equal(p.currentTime, 2000);
    assert.equal(p.startTime, 500);
    assert.equal(p.finished, true);
    assert.equal(p.playbackRate, 1);
    setTicking(true);
    p.play();
    tick(2700);
    assert.equal(p.startTime, 2700);
    assert.equal(p.currentTime, 0);
    assert.equal(p.finished, false);
    assert.equal(p.playbackRate, 1);
  });
  test('play after limit works as expected (reversed)', function() {
    tick(590);
    var p = document.body.animate([], 3000);
    tick(600);
    tick(700);
    p.reverse();
    tick(701);
    tick(900);
    assert.equal(p.startTime, 801);
    assert.equal(p.currentTime, 0);
    assert.equal(p.finished, true);
    assert.equal(p.playbackRate, -1);
    setTicking(true);
    p.play();
    tick(1000);
    assert.equal(p.startTime, 4000);
    assert.equal(p.currentTime, 3000);
    assert.equal(p.finished, false);
    assert.equal(p.playbackRate, -1);
  });
  test('seeking works as expected', function() {
    tick(690);
    var p = document.body.animate([], 2000);
    tick(700);
    tick(900);
    assert.equal(p.currentTime, 200);
    p.currentTime = 600;
    assert.equal(p.currentTime, 600);
    assert.equal(p.startTime, 300);
    p.reverse();
    tick(1000);
    assert.equal(p.startTime, 1600);
    p.currentTime = 300;
    assert.equal(p.currentTime, 300);
    assert.equal(p.startTime, 1300);
  });
  test('seeking while paused works as expected', function() {
    tick(790);
    var p = document.body.animate([], 1000);
    tick(800);
    tick(1000);
    p.pause();
    assert.equal(p.currentTime, null);
    assert.equal(p.startTime, null);
    assert.equal(p.paused, true);
    p.currentTime = 500;
    assert.equal(p.startTime, null);
    assert.equal(p.paused, true);
  });
  test('setting start time while paused is ignored', function() {
    tick(900);
    var p = document.body.animate([], 1234);
    p.pause();
    assert.equal(p.startTime, null);
    assert.equal(p.currentTime, null);
    p.startTime = 2232;
    assert.equal(p.startTime, null);
    assert.equal(p.currentTime, null);
  });
  test('finishing works as expected', function() {
    tick(1000);
    var p = document.body.animate([], 2000);
    p.finish();
    assert.equal(p.startTime, 0);
    assert.equal(p.currentTime, 2000);
    p.reverse();
    p.finish();
    assert.equal(p.currentTime, 0);
    assert.equal(p.startTime, 2000);
    tick(2000);
  });
  test('cancelling clears all effects', function() {
    tick(0);
    var target = document.createElement('div');
    document.documentElement.appendChild(target);
    var player = target.animate([{marginLeft: '50px'}, {marginLeft: '50px'}], 1000);
    tick(10);
    tick(110);
    assert.equal(getComputedStyle(target).marginLeft, '50px');
    player.cancel();
    // getComputedStyle forces a tick.
    assert.equal(getComputedStyle(target).marginLeft, '0px');
    assert.deepEqual(webAnimationsMinifill.timeline._players, []);
    tick(120);
    assert.equal(getComputedStyle(target).marginLeft, '0px');
    assert.deepEqual(webAnimationsMinifill.timeline._players, []);
    document.documentElement.removeChild(target);
  });
  test('startTime is set on first tick if timeline hasn\'t started', function() {
    webAnimationsMinifill.timeline.currentTime = undefined;
    var p = document.body.animate([], 1000);
    tick(0);
    tick(100);
    assert.equal(p.startTime, 0);
  });
  test('players which are finished and not filling get discarded', function() {
    tick(90);
    var nofill = document.body.animate([], 100);
    var fill = document.body.animate([], {duration: 100, fill: 'forwards'});
    assert.deepEqual(webAnimationsMinifill.timeline._players, [nofill._player || nofill, fill._player || fill]);
    tick(100);
    assert.deepEqual(webAnimationsMinifill.timeline._players, [nofill._player || nofill, fill._player || fill]);
    tick(400);
    assert.deepEqual(webAnimationsMinifill.timeline._players, [fill._player || fill]);
  });
  test('discarded players get re-added on modification', function() {
    tick(90);
    var player = document.body.animate([], 100);
    tick(100);
    tick(400);
    assert.deepEqual(webAnimationsMinifill.timeline._players, []);
    player.currentTime = 0;
    assert.deepEqual(webAnimationsMinifill.timeline._players, [player._player || player]);
  });
  test('players in the before phase are not discarded', function() {
    tick(100);
    var player = document.body.animate([], 100);
    player.currentTime = -50;
    tick(110);
    assert.deepEqual(webAnimationsMinifill.timeline._players, [player._player || player]);
  });
  test('players that go out of effect should not clear the effect of players that are in effect', function() {
    var target = document.createElement('div');
    document.body.appendChild(target);
    tick(0);
    var playerBehind = target.animate([{marginLeft: '200px'}, {marginLeft: '200px'}], 200);
    var playerInfront = target.animate([{marginLeft: '100px'}, {marginLeft: '100px'}], 100);
    tick(50);
    assert.equal(getComputedStyle(target).marginLeft, '100px', 't = 50');
    tick(150);
    assert.equal(getComputedStyle(target).marginLeft, '200px', 't = 150');
    tick(250);
    assert.equal(getComputedStyle(target).marginLeft, '0px', 't = 250');
    document.body.removeChild(target);
  });
  test('player modifications should update CSS effects immediately', function() {
    var target = document.createElement('div');
    document.body.appendChild(target);
    tick(0);
    var playerBehind = target.animate([{width: '1234px'}, {width: '1234px'}], {duration: 1, fill: 'both'});
    var playerInfront = target.animate([{width: '0px'}, {width: '100px'}], 100);
    assert.equal(getComputedStyle(target).width, '0px');
    playerInfront.currentTime = 50;
    assert.equal(getComputedStyle(target).width, '50px');
    playerInfront.currentTime = 100;
    assert.equal(getComputedStyle(target).width, '1234px');
    playerInfront.play();
    assert.equal(getComputedStyle(target).width, '0px');
    playerInfront.startTime = -50;
    assert.equal(getComputedStyle(target).width, '50px');
    document.body.removeChild(target);
  });
  test('Player that hasn\'t been played has playState \'idle\'', function() {
    var source = new minifillAnimation(document.body, [], 1000);
    var p = new Player(source);
    assert.equal(p.playState, 'idle');
  });
  test('playState works for a simple animation', function() {
    var p = document.body.animate([], 1000);
    tick(0);
    assert.equal(p.playState, 'running');
    tick(100);
    assert.equal(p.playState, 'running');
    p.pause();
    assert.equal(p.playState, 'pending');
    tick(101);
    assert.equal(p.playState, 'paused');
    p.play();
    assert.equal(p.playState, 'pending');
    tick(102);
    assert.equal(p.playState, 'running');
    tick(1002);
    assert.equal(p.playState, 'finished');
  });
  test('Play after cancel', function() {
    var p = document.body.animate([], 1000);
    assert.equal(p.playState, 'pending');
    tick(0);
    p.cancel();
    assert.equal(p.playState, 'idle');
    assert.equal(p.currentTime, null);
    assert.equal(p.startTime, null);
    tick(1);
    assert.equal(p.playState, 'idle');
    assert.equal(p.currentTime, null);
    assert.equal(p.startTime, null);
    p.play();
    assert.equal(p.playState, 'pending');
    assert.equal(p.currentTime, 0);
    assert.equal(p.startTime, null);
    tick(10);
    assert.equal(p.playState, 'running');
    assert.equal(p.currentTime, 0);
    assert.equal(p.startTime, 10);
  });
  test('Reverse after cancel', function() {
    var p = document.body.animate([], 300);
    tick(0);
    p.cancel();
    assert.equal(p.playState, 'idle');
    assert.equal(p.currentTime, null);
    assert.equal(p.startTime, null);
    tick(1);
    p.reverse();
    assert.equal(p.playState, 'pending');
    assert.equal(p.currentTime, 300);
    assert.equal(p.startTime, null);
    tick(100);
    assert.equal(p.playState, 'running');
    assert.equal(p.currentTime, 300);
    assert.equal(p.startTime, 400);
    tick(300);
    assert.equal(p.playState, 'running');
    assert.equal(p.currentTime, 100);
    assert.equal(p.startTime, 400);
    tick(400);
    assert.equal(p.playState, 'finished');
    assert.equal(p.currentTime, 0);
    assert.equal(p.startTime, 400);
  });
  test('Finish after cancel', function() {
    var p = document.body.animate([], 300);
    tick(0);
    p.cancel();
    assert.equal(p.playState, 'idle');
    assert.equal(p.currentTime, null);
    assert.equal(p.startTime, null);
    tick(1);
    p.finish();
    assert.equal(p.playState, 'idle');
    assert.equal(p.currentTime, null);
    assert.equal(p.startTime, null);
    tick(2);
    assert.equal(p.playState, 'idle');
    assert.equal(p.currentTime, null);
    assert.equal(p.startTime, null);
  });
  test('Pause after cancel', function() {
    var p = document.body.animate([], 300);
    tick(0);
    p.cancel();
    assert.equal(p.playState, 'idle');
    assert.equal(p.currentTime, null);
    assert.equal(p.startTime, null);
    tick(1);
    p.pause();
    assert.equal(p.playState, 'idle');
    assert.equal(p.currentTime, null);
    assert.equal(p.startTime, null);
  });
  test('Players ignore NaN times', function() {
    var p = document.body.animate([], 300);
    p.startTime = 100;
    tick(110);
    assert.equal(p.currentTime, 10);
    p.startTime = NaN;
    assert.equal(p.startTime, 100);
    p.currentTime = undefined;
    assert.equal(p.currentTime, 10);
  });
  test('play() should not set a start time', function() {
    var p = document.body.animate([], 1000);
    p.cancel();
    assert.equal(p.startTime, null);
    assert.equal(p.playState, 'idle');
    p.play();
    assert.equal(p.startTime, null);
    assert.equal(p.playState, 'pending');
  });
  test('reverse() should not set a start time', function() {
    var p = document.body.animate([], 1000);
    p.cancel();
    assert.equal(p.startTime, null);
    assert.equal(p.playState, 'idle');
    p.reverse();
    assert.equal(p.startTime, null);
    assert.equal(p.playState, 'pending');
  });
});
