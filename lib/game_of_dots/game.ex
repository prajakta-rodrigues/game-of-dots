defmodule GameOfDots.Game do

  def new(table_name, user_name, length, breadth) do
    %{
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
        validLinesRemaining: generateValidLines(5, 5),
        turn: 0,
        players: [],
        audience: []
      }
    end

    def generateValidLines(length, breadth) do
      validLines = [];
      validLines = generateValidHorizontalLines(length - 1, breadth - 1, []);
      validLines = generateVerticalLines(breadth - 1, length - 1, validLines);
      validLines
    end

    def generateVerticalLines(length, j, validLines) do
      if j == 0 do
        validLines
      end
      validLines = generateVertLines(length, j - 1, j, validLines)
      generateVerticalLines(length, j - 1, validLines)
      validLines
    end

    def generateVertLines(x, y1, y2, validLines) do
      if x == 0 do
        validLines
      end
      validLines = validLines ++ [%{x1: x, x2: x, y1: y1 , y2: y2}]
      generateVertLines(x-1, y1, y2, validLines)
      validLines
    end

    def generateValidHorizontalLines(i, breadth, validLines) do
      if i == 0 do
        validLines
      end
      validLines = generateHoriLines(i - 1, i, breadth, validLines )
      generateValidHorizontalLines(i-1, breadth, validLines)
      validLines
    end

    def generateHoriLines(x1, x2, y, validLines) do
      if y == 0 do
        validLines
      end
      validLines = validLines ++ [%{x1: x1, x2: x2, y1: y , y2: y}]
      generateHoriLines(x1, x2, y - 1, validLines)
      validLines
    end


    def client_view(game) do
      %{
        type: game.type,
        tableName: game.table_name,
        ownerId: game.user_name,
        gameStarted: game.gameStarted,
        gameOver: game.gameOver,
        dimensions: game.dimensions,
        linesDrawn: game.linesDrawn,
        validLinesRemaining: game.validLinesRemaining,
        turn: game.turn,
        players: game.players,
        audience: game.audience
      }
    end

    def draw(game, coords, userName) do
      if Enum.member?(game.validLinesRemaining, coords) do
        game.linesDrawn ++ [coords]
        if coords.y1 == coords.y2 do
          if Enum.member?(game.linesDrawn, %{x1: coords.x1, y1: coords.y1-1,
          x2: coords.x1, y2: coords.y1})
          && Enum.member?(game.linesDrawn, %{x1: coords.x2, y1: coords.y1-1,
          x2: coords.x2, y2: coords.y1})
          && Enum.member?(game.linesDrawn, %{x1: coords.x1, y1: coords.y1-1,
          x2: coords.x2, y2: coords.y1-1}) do
            # add to acquired
            newPlayers = Enum.map(game.players,
            fn(item) -> if(item[:name] == userName) do
              boxAcquired = item.boxesAcquired ++
              [%{x1: coords.x1, y1: (coords.y1 -1), x2: coords.x2, y2: coords.y2 }]
              item = %{item | boxesAcquired: boxAcquired}
            end end)
            game = %{game | players: newPlayers}
          end
          if Enum.member?(game.linesDrawn, %{x1: coords.x1, y1: coords.y1+1,
          x2: coords.x1, y2: coords.y1})
          && Enum.member?(game.linesDrawn, %{x1: coords.x2, y1: coords.y1+1,
          x2: coords.x2, y2: coords.y1})
          && Enum.member?(game.linesDrawn, %{x1: coords.x1, y1: coords.y1+1,
          x2: coords.x2, y2: coords.y1+1}) do

            newPlayers = Enum.map(game.players,
            fn(item) -> if(item[:name] == userName) do
              boxAcquired = item.boxesAcquired ++
              [%{x1: coords.x1, y1: (coords.y1 + 1), x2: coords.x2,y2: coords.y2 }]
              item = %{item | boxesAcquired: boxAcquired}

            end
          end)
          game = %{game | players: newPlayers}
        end
      end

    end
    game
  end

  def create_table(game, table_name, owner) do
    tables = Map.get(game, :tables)
    new_table = [%{:table_name => table_name, :owner => owner}]
    updated_tables = tables ++ new_table
    game = %{game | tables: updated_tables}
  end
end
