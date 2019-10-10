# Game of Dots
 
## What game are you going to build?
It is based on the age-old game played using pencil and paper. The game can be played by two or more players. It has multiple variants and its one popular variant is dots and boxes. The game board consists of a grid structure of dots. Each player gets a turn to draw a vertical or horizontal line joining two dots on the grid. If the line drawn completes any box in the grid, the player gets a point and another chance to play. The player who has completed maximum boxes wins the game. In another variant, called Strings-and-Coins there are various coins attached by various strings. In each turn, the player can cut one string and if the move frees the coin, the player scores a point. Our game will be adding additional rules to the traditional variant of the game to make it more interesting. 
 
## Is the game well specified (e.g. Reversi) or will it require some game work (e.g. a monster battle game)?
Yes the game is well specified. But we will be adding additional rules to increase the complexity of the game. The rules of the game will be as follows:
1. Every player gets to play a single line joining any 2 dots alternately.
2. If the player completes a box he gets to play an additional turn.
3. For every box that the user completes, he gets 5 points.
4. If the one user marks a territory border using lines around a set of boxes and no other user has marked any line in the entire territory border, the entire area is captured by the user and no other user can now mark a line in that territory. Also if the territory contains boxes already marked by any other user, the boxes also will be captured and its owner will change to the owner of the territory. A territory is any enclosed area with connected edges. You will get bonus points for creating a territory.
5. The game ends if all boxes are completed and the player with maximum number of completed boxes/territories wins(maximum number of points).
 
## Is there any game functionality that you’d like to include but may need to cut if you run out of time?
Yes, we would like to add the following functionality:
1. The game will have option to choose different shapes like triangles, hexagon and cross.
![triangle](assets/images/traingle.png)
![hexagon](assets/images/hexagon.jpg)
2. The players will try to enclose triangles and try to capture as many triangles as possible in the game of triangle and hexagon.
3. We will have a championship board where each player will be able to see their ranking compared to other players. Based on the games won by the player, points will get added and the cumulative score can be seen on the leadership board. The player gets a badge if he reaches a certain amount of points. There are three levels of badges(Bronze, Silver and Gold).     
## What challenges do you expect to encounter?
1. Using animation in the User Interface to draw lines by dragging the pointer from one dot to another and changing the color when the box or territory is captured.
2. Persisting user data and maintaining a leadership board with updated information and sorting the board based on the ranking.
3. Maintaining the scores of each player as the game state changes.
4. Handling simultaneous game sessions with continuous updates to the state of the game.
5. Creating and enforcing robust rules so that the player does not find a way to cheat.
6. Avoiding data leak, data of one player should not be available to any other player.