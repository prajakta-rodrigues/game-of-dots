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
      validLinesRemaining: generateValidLines(length - 1, breadth - 1),
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

  def append_msg(game, msg, user) do
    message = %{
      name: user,
      text: msg
    }

    # message_new = [game.messages | msg]
    IO.inspect(message)
    message_new = game.messages ++ [message]
    Map.put(game, :messages, message_new)
  end

  def generateValidLines(length, breadth) do
    validLines = []
    validLines = generateValidHorizontalLines(length, breadth, [])
    validLines = generateVerticalLines(length, breadth, validLines)
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

  def generateVertLines(length, breadth, validLines) do
    IO.puts("vert here")
    IO.puts("length")
    IO.puts(length)
    IO.puts("breadth")
    IO.puts(breadth)

    if length == 0 do
      IO.inspect(validLines)
      validLines
    else
      validLines =
        validLines ++ [%{"x1" => length - 1, "x2" => length, "y1" => breadth, "y2" => breadth}]

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
      validLines =
        validLines ++ [%{"y1" => length - 1, "y2" => length, "x1" => breadth, "x2" => breadth}]

      length = length - 1
      validLines = generateHoriLines(length, breadth, validLines)
      validLines
    end
  end

  def client_view(game) do
    game
  end

  def checkAlongY1Axis(game, coords, userName, turn) do
    if coords["y1"] == coords["y2"] do
      IO.inspect("check if y1 equals")

      if Enum.member?(game.linesDrawn, %{
           "x1" => coords["x1"],
           "y1" => coords["y1"] - 1,
           "x2" => coords["x1"],
           "y2" => coords["y1"]
         }) &&
           Enum.member?(game.linesDrawn, %{
             "x1" => coords["x2"],
             "y1" => coords["y1"] - 1,
             "x2" => coords["x2"],
             "y2" => coords["y1"]
           }) &&
           Enum.member?(game.linesDrawn, %{
             "x1" => coords["x1"],
             "y1" => coords["y1"] - 1,
             "x2" => coords["x2"],
             "y2" => coords["y1"] - 1
           }) do
        # add to acquired
        IO.puts("Atleast condition achieved")

        newPlayers =
          Enum.map(
            game.players,
            fn item ->
              if(item[:name] == userName) do
                boxAcquired =
                  item.boxesAcquired ++
                    [
                      %{
                        "x1" => coords["x1"],
                        "y1" => coords["y1"] - 1,
                        "x2" => coords["x2"],
                        "y2" => coords["y2"]
                      }
                    ]

                item = Map.put(item, :boxesAcquired, boxAcquired)
                item = Map.put(item, :score, item.score + 5)
                # IO.puts("item modi")
                # IO.inspect(item)
              else
                item
              end
            end
          )

        game = Map.put(game, :players, newPlayers)
        game = Map.put(game, :turn, turn)
        IO.puts("see here")
        IO.inspect(game)
        IO.puts("before")
        game
      else
        game
      end
    else
      IO.puts("not equals")
      IO.inspect(coords)
      game
    end
  end

  def checkAlongY2Axis(game, coords, userName, turn) do
    if coords["y1"] == coords["y2"] do
      IO.inspect("check if y2 equals")
      IO.puts("input")
      IO.inspect(coords)
      IO.puts("processing")

      if Enum.member?(game.linesDrawn, %{
           "x1" => coords["x1"],
           "y1" => coords["y1"],
           "x2" => coords["x1"],
           "y2" => coords["y1"] + 1
         }) &&
           Enum.member?(game.linesDrawn, %{
             "x1" => coords["x2"],
             "y1" => coords["y1"],
             "x2" => coords["x2"],
             "y2" => coords["y1"] + 1
           }) &&
           Enum.member?(game.linesDrawn, %{
             "x1" => coords["x1"],
             "y1" => coords["y1"] + 1,
             "x2" => coords["x2"],
             "y2" => coords["y1"] + 1
           }) do
        # add to acquired
        IO.puts("y2 condition achieved")

        newPlayers =
          Enum.map(
            game.players,
            fn item ->
              if(item[:name] == userName) do
                boxAcquired =
                  item.boxesAcquired ++
                    [
                      %{
                        "x1" => coords["x1"],
                        "y1" => coords["y1"] + 1,
                        "x2" => coords["x2"],
                        "y2" => coords["y2"]
                      }
                    ]

                item = Map.put(item, :boxesAcquired, boxAcquired)
                item = Map.put(item, :score, item.score + 5)
              else
                item
              end
            end
          )

        game = Map.put(game, :players, newPlayers)
        game = Map.put(game, :turn, turn)
        IO.puts("see here")
        IO.inspect(game)
        IO.puts("before")
        game
      else
        game
      end
    else
      IO.puts("not equals")
      IO.inspect(coords)
      game
    end
  end

  def checkAlongX1Axis(game, coords, userName, turn) do
    if coords["x1"] == coords["x2"] do
      IO.inspect("check if x1 equals")
      IO.puts("input")
      IO.inspect(coords)
      IO.puts("processing")

      if Enum.member?(game.linesDrawn, %{
           "x1" => coords["x1"] - 1,
           "y1" => coords["y1"],
           "x2" => coords["x1"] - 1,
           "y2" => coords["y2"]
         }) &&
           Enum.member?(game.linesDrawn, %{
             "x1" => coords["x1"] - 1,
             "y1" => coords["y1"],
             "x2" => coords["x1"],
             "y2" => coords["y1"]
           }) &&
           Enum.member?(game.linesDrawn, %{
             "x1" => coords["x1"] - 1,
             "y1" => coords["y2"],
             "x2" => coords["x1"],
             "y2" => coords["y2"]
           }) do
        # add to acquired
        IO.puts("x1 condition achieved")

        newPlayers =
          Enum.map(
            game.players,
            fn item ->
              if(item[:name] == userName) do
                boxAcquired =
                  item.boxesAcquired ++
                    [
                      %{
                        "x1" => coords["x1"] - 1,
                        "y1" => coords["y1"],
                        "x2" => coords["x1"],
                        "y2" => coords["y2"]
                      }
                    ]

                item = Map.put(item, :boxesAcquired, boxAcquired)
                item = Map.put(item, :score, item.score + 5)

                # IO.puts("item modi")
                # IO.inspect(item)
              else
                item
              end
            end
          )

        game = Map.put(game, :players, newPlayers)
        game = Map.put(game, :turn, turn)
        IO.puts("see here")
        IO.inspect(game)
        IO.puts("before")
        game
      else
        game
      end
    else
      IO.puts("not equals")
      IO.inspect(coords)
      game
    end
  end

  def checkAlongX2Axis(game, coords, userName, turn) do
    if coords["x1"] == coords["x2"] do
      IO.inspect("check if x1 equals")
      IO.puts("input")
      IO.inspect(coords)
      IO.puts("processing")

      if Enum.member?(game.linesDrawn, %{
           "x1" => coords["x1"] + 1,
           "y1" => coords["y1"],
           "x2" => coords["x1"] + 1,
           "y2" => coords["y2"]
         }) &&
           Enum.member?(game.linesDrawn, %{
             "x1" => coords["x1"],
             "y1" => coords["y1"],
             "x2" => coords["x1"] + 1,
             "y2" => coords["y1"]
           }) &&
           Enum.member?(game.linesDrawn, %{
             "x1" => coords["x1"],
             "y1" => coords["y2"],
             "x2" => coords["x1"] + 1,
             "y2" => coords["y2"]
           }) do
        # add to acquired
        IO.puts("x2 condition achieved")

        newPlayers =
          Enum.map(
            game.players,
            fn item ->
              if(item[:name] == userName) do
                boxAcquired =
                  item.boxesAcquired ++
                    [
                      %{
                        "x1" => coords["x1"],
                        "y1" => coords["y1"],
                        "x2" => coords["x1"] + 1,
                        "y2" => coords["y2"]
                      }
                    ]

                item = Map.put(item, :boxesAcquired, boxAcquired)
                item = Map.put(item, :score, item.score + 5)

                # IO.puts("item modi")
                # IO.inspect(item)
              else
                item
              end
            end
          )

        game = Map.put(game, :players, newPlayers)
        game = Map.put(game, :turn, turn)
        IO.puts("see here")
        IO.inspect(game)
        IO.puts("before")
        game
      else
        game
      end
    else
      IO.puts("not equals")
      IO.inspect(coords)
      game
    end
  end

  def verifyCoordsX(coords) do
    if coords["x1"] > coords["x2"] do
      IO.puts("output")
      temp = coords["x1"]
      coords = Map.put(coords, "x1", coords["x2"])
      coords = Map.put(coords, "x2", temp)
      temp = coords["y1"]
      coords = Map.put(coords, "y1", coords["y2"])
      coords = Map.put(coords, "y2", temp)
    else
      coords
    end
  end

  def verifyCoordsY(coords) do
    if coords["y1"] > coords["y2"] do
      IO.puts("output")
      temp = coords["y1"]
      coords = Map.put(coords, "y1", coords["y2"])
      coords = Map.put(coords, "y2", temp)
      temp = coords["x1"]
      coords = Map.put(coords, "x1", coords["x2"])
      coords = Map.put(coords, "x2", temp)
    else
      coords
    end
  end

  def draw(game, coords, userName) do
    IO.puts("In draw")
    IO.puts("before coords")
    IO.inspect(coords)
    IO.inspect(game.validLinesRemaining)
    coords = verifyCoordsX(coords)
    coords = verifyCoordsY(coords)
    IO.puts("before coords")
    IO.inspect(coords)

    if Enum.member?(game.validLinesRemaining, coords) do
      IO.puts("Step 1")
      IO.inspect(coords)
      IO.inspect(game.linesDrawn)
      linesDrawn = game.linesDrawn ++ [coords]
      validLinesRemaining = game.validLinesRemaining -- [coords]
      length = length(game.players)
      game = Map.put(game, :linesDrawn, linesDrawn)
      game = Map.put(game, :validLinesRemaining, validLinesRemaining)
      prevTurn = game.turn
      turn = rem(game.turn + 1, length)
      game = Map.put(game, :turn, turn)
      # IO.inspect(game)
      game = checkAlongY1Axis(game, coords, userName, prevTurn)
      game = checkAlongY2Axis(game, coords, userName, prevTurn)
      game = checkAlongX1Axis(game, coords, userName, prevTurn)
      game = checkAlongX2Axis(game, coords, userName, prevTurn)

      if length(game.validLinesRemaining) == 0 do
        game = Map.put(game, :gameOver, true)
        game
      else
        game
      end
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
        boxesAcquired: []
      }

      players = game.players ++ [newPlayer]
      game = Map.put(game, :players, players)
      game
    else
      player_names = Enum.map(players, fn player -> player.name end)

      is_member = Enum.member?(player_names, user_name)

      if is_member == false do
        newPlayer = %{
          name: user_name,
          color: new_color(length(game.players)),
          score: 0,
          boxesAcquired: []
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
    colors = ~w(#fcba03 #acba09 #fc5a03 #84fc03 #03dbfc #0394fc)
    {:ok, color} = Enum.fetch(colors, player_no)
    color
  end

  def resetGame(game, user) do
    game = Map.put(game, :gameOver, false)
    game = Map.put(game, :gameStarted, false)
    game = Map.put(game, :linesDrawn, [])
    game = Map.put(game, :turn, 0)

    game =
      Map.put(
        game,
        :validLinesRemaining,
        generateValidLines(
          game.dimensions.length - 1,
          game.dimensions.breadth - 1
        )
      )

    newPlayers =
      Enum.map(
        game.players,
        fn item ->
          item = Map.put(item, :boxesAcquired, [])
          item = Map.put(item, :score, 0)
        end
      )

    game = Map.put(game, :players, newPlayers)
    game
  end
end
