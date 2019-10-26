defmodule GameOfDots.Game do

  def new(table_name, user_name, length, breadth, capacity) do
    game = %{
      type: "square",
      tableName: table_name,
      ownerId: user_name,
      gameStarted: false,
      gameOver: false,
      dimensions: %{
        length: length,
        breadth: length
        },
        linesDrawn: [],
        validLinesRemaining: generateValidLines(2, 2),
        turn: 0,
        players: [],
        audience: [],
        capacity: capacity - 1,
        messages: []
      }
      IO.puts("overhere")
      game = add_player(game, user_name)
      game
    end


    def append_msg(game, msg) do
      message_new = [game.messages | msg]
      %{game | messages: message_new}
    end

    def generateValidLines(length, breadth) do
      validLines = [];
      validLines = generateValidHorizontalLines(length, breadth, []);
      validLines = generateVerticalLines(length, breadth, validLines);
      validLines
    end

    def generateVerticalLines(length, breadth, validLines) do
      IO.puts("reached here")
      IO.puts("length")
      IO.puts(length)
      IO.puts("breadth")
      IO.puts(breadth)
      if breadth < 0 do
        validLines
      else
        validLines = generateVertLines(length, breadth, validLines)
        IO.puts("after vert call")
        IO.inspect(validLines)
        breadth = breadth - 1
        validLines = generateVerticalLines(length, breadth, validLines)
        validLines
      end
    end

    def generateVertLines(length, breadth , validLines) do
      IO.puts("vert here")
      IO.puts("length")
      IO.puts(length)
      IO.puts("breadth")
      IO.puts(breadth)
      if length == 0 do
        IO.inspect(validLines)
        validLines
      else
        validLines = validLines ++ [%{"x1" => length - 1, "x2" => length,
        "y1" => breadth , "y2" => breadth}]
        length = length - 1
        validLines = generateVertLines(length, breadth, validLines)
        validLines
      end
    end

    def generateValidHorizontalLines(length, breadth, validLines) do
      IO.puts("reached here")
      IO.puts("length")
      IO.puts(length)
      IO.puts("breadth")
      IO.puts(breadth)
      if breadth < 0 do
        validLines
      else
        validLines = generateHoriLines(length, breadth, validLines)
        IO.puts("after vert call")
        IO.inspect(validLines)
        breadth = breadth - 1
        validLines = generateValidHorizontalLines(length, breadth, validLines)
        validLines
      end
    end

    def generateHoriLines(length, breadth, validLines) do
      IO.puts("vert here")
      IO.puts("length")
      IO.puts(length)
      IO.puts("breadth")
      IO.puts(breadth)
      if length == 0 do
        IO.inspect(validLines)
        validLines
      else
        validLines = validLines ++ [%{"y1" => length - 1, "y2" => length,
        "x1" => breadth , "x2" => breadth}]
        length = length - 1
        validLines = generateHoriLines(length, breadth, validLines)
        validLines
      end
    end


    def client_view(game) do
      game
      # %{
      #   type: game.type,
      #   tableName: game.table_name,
      #   ownerId: game.user_name,
      #   gameStarted: game.gameStarted,
      #   gameOver: game.gameOver,
      #   dimensions: game.dimensions,
      #   linesDrawn: game.linesDrawn,
      #   validLinesRemaining: game.validLinesRemaining,
      #   turn: game.turn,
      #   players: game.players,
      #   audience: game.audience
      # }
    end

    def draw(game, coords, userName) do
      IO.puts("In draw")
      IO.inspect(coords);
      IO.inspect(game.validLinesRemaining);
      if Enum.member?(game.validLinesRemaining, coords) do
        IO.puts("Step 1")
        IO.inspect(coords)
        IO.inspect(game.linesDrawn)
        linesDrawn = game.linesDrawn ++ [coords]
        game = Map.put(game, :linesDrawn, linesDrawn)
        IO.inspect(game)
        if coords["y1"] == coords["y2"] do
          if Enum.member?(game.linesDrawn, %{"x1" => coords["x1"],
          "y1" => coords["y1"]-1,
          "x2" => coords["x1"], "y2" => coords["y1"]})
          && Enum.member?(game.linesDrawn, %{"x1" => coords["x2"],
          "y1" => coords["y1"]-1,
          "x2" => coords["x2"], "y2" => coords["y1"]})
          && Enum.member?(game.linesDrawn, %{"x1" => coords["x1"],
          "y1" => coords["y1"]-1,
          "x2" => coords["x2"], "y2" => coords["y1"]-1}) do
            # add to acquired
            newPlayers = Enum.map(game.players,
            fn(item) -> if(item[:name] == userName) do
              boxAcquired = item.boxesAcquired ++
              [%{"x1" => coords["x1"], "y1" => coords["y1"] -1, "x2" => coords["x2"],
              "y2" => coords["y2"] }]
              item = %{item | boxesAcquired: boxAcquired}
            end end)
            game = %{game | players: newPlayers}
          end
          if Enum.member?(game.linesDrawn, %{"x1" => coords["x1"],
          "y1" => coords["y1"]+1,
          "x2" => coords["x1"], "y2" => coords["y1"]})
          && Enum.member?(game.linesDrawn, %{"x1" => coords["x2"],
          "y1" => coords["y1"]+1,
          "x2" => coords.x2, "y2" => coords["y1"]})
          && Enum.member?(game.linesDrawn, %{"x1" => coords["x1"],
          "y1" => coords["y1"]+1,
          "x2" => coords["x2"], "y2" => coords["y1"]+1}) do

            newPlayers = Enum.map(game.players,
            fn(item) -> if(item[:name] == userName) do
              boxAcquired = item.boxesAcquired ++
              [%{"x1" => coords["x1"], "y1" => (coords["y1"] + 1),
              "x2" => coords["x2"],
              "y2" => coords["y2"] }]
              item = %{item | boxesAcquired: boxAcquired}

            end
          end)
          game = %{game | players: newPlayers}
        end
      end
      game
    else
      game
    end
  end

  def create_table(game, table_name, owner) do
    tables = Map.get(game, :tables)
    new_table = [%{:table_name => table_name, :owner => owner}]
    updated_tables = tables ++ new_table
    game = %{game | tables: updated_tables}
  end

  def add_player(game, user_name) do

    players = game.players

    if players == nil do
      newPlayer = %{
        name: user_name,
        color: new_color(length(game.players)),
        score: 0,
        boxesAcquired: [
        ]
      }
    players = game.players ++ [newPlayer]
    game = Map.put(game, :players, players)
    game
    else
      player_names = Enum.map(players, fn (player) -> player.name end)

      is_member = Enum.member?(player_names, user_name)

    if is_member == false do
      newPlayer = %{
        name: user_name,
        color: new_color(length(game.players)),
        score: 0,
        boxesAcquired: [
        ]
      }
    players = game.players ++ [newPlayer]
    game = Map.put(game, :players, players)
    game
    else
      game
    end
    end
  end

  def startGame(game, user) do

    if game.gameStarted == false && game.ownerId == user do
      IO.puts("On right track")
      game = Map.put(game, :gameStarted, true)
      game
    else
      IO.puts("went her instead")
      game
    end
  end

  def new_color(player_no) do
    colors = ~w(fcba03 acba09 fc5a03 84fc03 03dbfc 0394fc)
    {:ok, color} = Enum.fetch(colors, player_no)
    color
  end

end
