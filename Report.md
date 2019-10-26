# Game of Dots
 
## Authors:
1. Prajakta Rodrigues
2. Sukhada Khatu
 
## Introduction and Game Description
Game of Dots is based on the age-old game played using pencil and paper. The 
game can be played by two or more players. It has multiple variants and its one
popular variant is dots and boxes. The game board consists of a grid structure 
of dots. Each player gets a turn to draw a vertical or horizontal line joining
two dots on the grid. If the line drawn completes any box in the grid, the 
player gets a point and another chance to play. The player who has completed 
maximum boxes wins the game. In another variant, called Strings-and-Coins there
are various coins attached by various strings. In each turn, the player can cut 
one string and if the move frees the coin, the player scores a point. Our game 
will be adding additional rules to the traditional variant of the game to make 
it more interesting. 

Rules of the game:
Aim of this game is to capture as many boxes as possible. The user can join the
game as player or just to watch the game. All the users can chat in the game 
table. The owner of the game is the one who creates the game and only the 
owner has the option to start the game. Every player gets to play a single 
line joining any 2 dots alternately. You cannot draw over an existing line. 
An already existing box cannot be captured. When the game completes the owner
of the table has the option to reset the game. When the game is reset the 
players remain in the table. The user has option to watch the game. If the user
chooses to watch the game the user cannot participate in the game. The audience
can only chat in the chat window. Once the game is reset the audience also 
remains in the table. Once the capacity of a game table is reached no new 
players are allowed to enter the game table. Player cannot draw diagonal lines.
Every game table has a fixed number of players capacity. If the player 
completes a box he gets to play an additional turn. For every box that the user
completes, he gets 5 points.


## UI Design
Every user needs to login with a user name. User name cannot be empty. If we
try to submit with empty string you get an alert to enter a user name. Then the
user is redirected to page where all the existing tables are displayed. The
user can join the existing table or create a new table. If a user creates a 
table, user is automatically added to the game as a player. The user can create 
a table, the table name cannot be empty. The user can watch the game where he 
cannot participate in the game but observe it and chat in the chat window. The
user who creates the table is the owner of the table. Only the owner of the 
table can start the game. The owner can start the game whenever he wants to 
after the capacity has reached. There is a capacity associated with grid size. 
If the capacity becomes zero no user is allowed to join the game but they can
watch the game. Once the game starts every player gets a chance to draw a line
vertically or horizontally. After the game ends the owner has the option to 
reset the game. When the owner resets the game, the game state resets to the 
initial state. All the players and audience remain in the game. All the users 
who have joined the game as a player or as audience can chat in the chat window.
There is no limit on the number of users joining as audience. Each player is 
assigned a color, the player draws a line and captures as many boxes as 
possible. The player with maximum boxes captured wins. When the game is over 
the initial state of the game is reset and the players and the audience remain 
in the game. Once you login there is a search option to search the table and 
the view updates based on the values inserted in the search bar. In the game 
table the score, whose turn it is and the players playing the game are 
displayed. After the game is over the winners are displayed. If there is a tie
both the winners are displayed.User name is mandatory. If a username is not 
given an alert message is shown to enter username. Similarly, table name is 
also mandatory. By default a 3*3 grid is selected. 
 
## UI to Server Protocol
To communicate between UI and the server we are using sockets and channels by 
passing data through specific channel. To get all the tables in the system we 
use a generic channel which will be used by all the users logged in to the 
system. Based on the game table selected the channel is connected. Each game 
table will have a seperate channel. The same channel is used for chatting in 
the game table. The channel gets passed to game table after it is joined. The 
users can connect to the channel only when they are added as a player or the 
enter the game to watch the game. We use broadcast so that all the users are 
updated at real time. We use BackupAgent to save the state of the game so if a 
player crashes and rejoins the game the state of the game is saved. The game 
channel is game:<table name> and for login the channel name is login:Admin. 
Since all the users logging in need to see the same tables the channel is same.
Once the connection is established, each incoming message from a client is 
routed, based on its topic, to the correct channel server. If the channel 
server wants to broadcast, the message is sent to the PubSub, which sends to 
all the clients connected to the same server and subscripted to same topic. 
Channels can go both directions- incoming and outgoing. Whenever there is an 
update in the state of the game it is backed up in the BackupAgent so that in 
case of crash the previous state of the game is restored.

## Data structures on server
List of tables is stored on server where each table is an object that contains 
table name of type string, owner name of type string, players list. This list 
is used to display list of tables. Each individual game has owner id of type 
string, table name of type string, type, dimensions which is a map of length 
and breadth. This length and breadth will be used to create the game grid. 
Both length and breadth are of type integer. linesDrawn is a list of lines 
which are drawn so far in the game. Each line drawn is an object which contains
4 coordinates of the line. ValidLinesRemaining is a list consisting of valid 
lines remaining in the game. x1, y1, x2, y2 are the coordinates of the line in 
validLinesRemaining. Turn will be used to decide which player’s turn it is. It 
is an integer. Players consists of list of players playing the game. Each 
player is an object which contains player name of type string, color associated
with the player which is a hexadecimal code assigned to each player, each 
player gets a unique color, current score of type integer, boxesAcquired by the
player. BoxesAcquired is the list of boxes acquired by the player. It consists 
of an object, this object has 4 coordinates x1, x2, y1, y2. These coordinates 
corresponds to the diagonal forming the box. Messages is a list consisting of 
messages received from all the users who have joined in as players or as 
audience. Message is a list of objects, where each object contains message and 
user who sends the message. We have used modal for pop-up. Home component is 
used to display the login page and popup component is used for game info popup. 
Tables component is used to display the list of tables.We have used Stage, 
Layer, Line and Circle from react konva.

## Implementation of game rules
A user can create a table or join existing table. Each table has maximum 
capacity associated with it. When the table is created, the user is added as 
the owner of the table and also the player. The owner can start the game 
whenever he wants after the capacity is reached. When the owner starts the 
game other users are allowed to make a move when there turn comes up. Each 
player makes a move which is either horizontal or vertical line. When a player 
creates a box he gets another move to play. When a player creates a box he gets 
5 points. This continues until all the boxes are captured. The player with 
maximum points wins. The users who join in to watch are only allowed to watch 
the game, they cannot participate in the game. These users can chat in the chat 
window. There is no limit on the number of users who can join to watch the game.
The user can choose the dimensions of the game while creating the game. Each 
table dimension has capacity associated with it. 3*3 has of capacity of 2 
player, 4*4 has capacity of 6 players, 5*5 has capacity of 8 players, 6*6 has 
capacity of 10 players, 7*7 has capacity of 12 players, 8*8 has capacity of 14 
players, 9*9 has capacity of 16 players, 10*10 has capacity of 18 players. Once 
the game is over the owner can reset the game. When the game is reset the game 
state goes back to the initial state when the players are joined and the game 
hasn’t started yet. All the players remain joined in the game also the audience 
remain in the game.

## Challenges and Solutions

The challenges in the projects were the communication between the client and 
the server. The main challenge was to create the UI using react konva. As 
Another challenge was the communication between pages and passing the channel. 
We first created the channel to join the game, we also needed a generic channel 
to fetch the common data like list of tables. So we created another channel. 
Another challenge was storing the game state. Since the game required to save 
the coordinates of the lines drawn, finding which line was drawn and if it 
formed a square was difficult to find. The solution for this was to save the 
lines as objects with the coordinates as the values in the object. Another 
challenge was to enforce the game rules. Changing the game state when a player 
makes a move and keeping track of the scores. We also needed to restrict users 
if the capacity was reached. Communication between pages was a problem, since 
we had two channels we needed to update the values in both the channel for 
which data is common. Designing the game to decide what features are feasible 
was difficult. Since the game state had many fields it was difficult to update 
them when a line is drawn. Handling the broadcast and saving the backup of the 
game. The game was backed up using a BackupAgent. Updating the state of the 
game when move is played. Checking if the box is formed was difficult since 
we only had the coordinates of the lines drawn so far. So to check if it forms 
a box it needs to check all the lines above and below it also the lines on both 
sides to form a box. This was difficult to calculate. Also, reflecting the 
changes or moves made by one person to all other people playing the same game 
wasn’t something we had done before. Since we did not have routing we had to 
pass states which was a challenge. Communication between different components 
was a challenge where we communicated between parent and child components 
using callback functions.

## Citation

1. https://github.com/NatTuck/memory

2. https://hexdocs.pm/phoenix/Phoenix.Channel.html
