var BubbleShoot = window.BubbleShoot || {};
BubbleShoot.ui = (function ($) {
    var ui = {
        BUBBLE_DIMS: 94,
        ROW_HEIGHT: 100,
        init: function () {},
        getMouseCoords: function (e) {
            var coords = {
                x: e.pageX,
                y: e.pageY
            };
            return coords;
        },
        drawScore: function (score) {
            $('#score').text(score);
        },
        getBubbleCoords: function (bubble) {
            var bubbleCoords = bubble.position();
            bubbleCoords.left += ui.BUBBLE_DIMS / 2;
            bubbleCoords.top += ui.BUBBLE_DIMS / 2;
            return bubbleCoords;
        },
        getBubbleAngle: function (bubble, e) {
            var mouseCoords = ui.getMouseCoords(e);
            var bubbleCoords = ui.getBubbleCoords(bubble);
            var gameCoords = $("#game").position();
            var boardLeft = 120;
            var angle = Math.atan((mouseCoords.x - bubbleCoords.left - boardLeft) / (bubbleCoords.top + gameCoords.top - mouseCoords.y));
            if (mouseCoords.y > bubbleCoords.top + gameCoords.top) {
                angle += Math.PI;
            }
            return angle;
        },
        fireBubble: function (bubble, coords, duration) {
            bubble.getSprite().animate({
                left: coords.x - ui.BUBBLE_DIMS / 2,
                top: coords.y - ui.BUBBLE_DIMS / 2
            }, {
                duration: duration,
                easing: "linear",
                complete: function () {
                    if (bubble.getRow() !== null) {
                        bubble.getSprite().css({
                            left: bubble.getCoords().left - ui.BUBBLE_DIMS / 2,
                            top: bubble.getCoords().top - ui.BUBBLE_DIMS / 2
                        });
                    };
                }
            });
        },
        drawBoard: function (board) {
            var rows = board.getRows();
            var gameArea = $("#board");
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                for (var j = 0; j < row.length; j++) {
                    var bubble = row[j];
                    if (bubble) {
                        var sprite = bubble.getSprite();
                        gameArea.append(sprite);
                        var left = j * ui.BUBBLE_DIMS / 2;
                        var top = i * ui.ROW_HEIGHT;
                        sprite.css({
                            left: left,
                            top: top
                        });
                    };
                };
            };
        },
        drawBubblesRemaining: function (numBubbles) {
            $("#bubbles_remaining").text(numBubbles);
        },
        endGame: function (hasWon, score) {
            $("#game").unbind("click");
            $("#top_bar").fadeOut(300);

            if (hasWon) {
                $('#next_level').fadeIn(3000);
                $('#next_level h2').text(score);

            } else {
                BubbleShoot.ui.drawScore(0);
                $('#end_game').fadeIn(300);
                $('#end_game h2').text(score);
            }
            
            

        }
    };
    return ui;
})(jQuery);