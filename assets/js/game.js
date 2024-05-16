var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.Game = (function($) {
  var Game = function() {
    var curBubble;
    var board;
    var numBubbles;
    var MAX_BUBBLES = 70;
    var level = 0;
    var score = 0;
    var POINTS_PER_BUBBLE = 1;

    this.init = function() {
      $(".but_start_game").on('click', startGame);
    };

    var startGame = function() {
      $(".but_play_again").off('click');
      $("#next_level").fadeOut(300);
      $("#end_game").fadeOut(300);
      $("#start_game").fadeOut(300);
      $('.instructions').fadeIn(300);
      $("#top_bar").fadeIn(300);
      numBubbles = MAX_BUBBLES - level * 10;
      curBubble = getNextBubble();
      board = new BubbleShoot.Board();
      BubbleShoot.ui.drawBoard(board);
      $("#game").bind("click", clickGameScreen);
    };
    var getNextBubble = function() {
      var bubble = BubbleShoot.Bubble.create();
      bubble.getSprite().addClass("cur_bubble pacing");
      $("#board").append(bubble.getSprite());
      BubbleShoot.ui.drawBubblesRemaining(numBubbles);
      numBubbles--;
      BubbleShoot.ui.drawScore(score);

      return bubble;
    };

    var clickGameScreen = function(e) {
      var angle = BubbleShoot.ui.getBubbleAngle(curBubble.getSprite(), e);
      var duration = 750;
      var distance = 2000;
      var collision = BubbleShoot.CollisionDetector.findIntersection(curBubble, board, angle);
      if (collision) {
        var coords = collision.coords;
        duration = Math.round(duration * collision.distToCollision / distance);
        board.addBubble(curBubble, coords);
        var group = board.getGroup(curBubble, {});
        if (group.list.length >= 3) {
          popBubbles(group.list, duration);
          var topRow = board.getRows()[0];
          var topRowBubbles = [];
          for (var i = 0; i < topRow.length; i++) {
            if (topRow[i]) {
              topRowBubbles.push(topRow[i]);
            }
          }
          if (topRowBubbles.length <= 5) {
            popBubbles(topRowBubbles, duration);
            group.list.concat(topRowBubbles);
          }
          var orphans = board.findOrphans();
          var delay = duration + 200 + 30 * group.list.length;
          dropBubbles(orphans, delay);
          var popped = [].concat(group.list, orphans);
          var points = popped.length * POINTS_PER_BUBBLE;
          score += points;
          setTimeout(function() {
            BubbleShoot.ui.drawScore(score);
          }, delay);
        };
      } else {
        var distX = Math.sin(angle) * distance;
        var distY = Math.cos(angle) * distance;
        var bubbleCoords = BubbleShoot.ui.getBubbleCoords(curBubble.getSprite());
        var coords = {
          x: bubbleCoords.left + distX,
          y: bubbleCoords.top - distY
        };
      };
      BubbleShoot.ui.fireBubble(curBubble, coords, duration);
      $(".cur_bubble").removeClass('pacing');
      $('.instructions').fadeOut(200);
      $('.cannon').addClass('cannonAnimation');
      setTimeout(function() {
        $('.cannon').removeClass('cannonAnimation');
      }, duration);
      if (board.getRows().length > 6) {
        endGame(false);
      } else if (numBubbles == 0) {
        endGame(false);
      } else if (board.isEmpty()) {
        setTimeout(endGame(true), 3000);
      } else {
        curBubble = getNextBubble();
      }
    };
    var popBubbles = function(bubbles, delay) {
      $.each(bubbles, function() {
        var bubble = this;
        setTimeout(function() {
          bubble.animatePop();
        }, delay);
        board.popBubbleAt(this.getRow(), this.getCol());
        setTimeout(function() {
          bubble.getSprite().remove();
        }, delay + 200);
        delay += 60;
      });
    };
    var dropBubbles = function(bubbles, delay) {
      $.each(bubbles, function() {
        var bubble = this;
        board.popBubbleAt(bubble.getRow(), bubble.getCol());
        setTimeout(function() {
          bubble.getSprite().kaboom();
        }, delay);
      });
    };
    var endGame = function(hasWon) {
      BubbleShoot.ui.endGame(hasWon, score);
      $('.but_play_again').on('click', startGame);

      if (hasWon) {
        level++;
      } else {
        level = 0;
        score = 0;
        $("#board .bubble").remove();
      }
    }
  };
  return Game;
})(jQuery);
