defmodule GameOfDots.Game do

  def new(type, dimensions, playerNames, owner, name) do
    %{
      type: "square",
      gameName:"game1",
      ownerId:"User1",
      gameStarted: false,
      gameOver: false,
      dimensions: %{
        length: 5,
        breadth: 5
      },
      linesDrawn: [],
      validLinesRemaining: [],
      turn: 0,
      players: []
    }
  end


  def client_view(game) do
    %{


    }
  end

  def draw(game, coords, userName) do

  end

end
