defmodule GameOfDots.Game do

  def new(table_name, user_name, length, breadth) do
    %{
      type: "square",
      tableName: table_name,
      ownerId: "User1",
      gameStarted: false,
      gameOver: false,
      dimensions: %{
        length: length,
        breadth: breadth
      },
      linesDrawn: [],
      validLinesRemaining: [],
      turn: 0,
      players: [user_name],
      tables: [],
      audience: []
    }
  end


  def client_view(game) do
    game
  end

  def draw(game, coords, userName) do

  end

  def create_table(game, table_name, owner) do 
    tables = Map.get(game, :tables)
    new_table = [%{:table_name => table_name, :owner => owner}]
    updated_tables = tables ++ new_table
    game = %{game | tables: updated_tables}
  end
end
