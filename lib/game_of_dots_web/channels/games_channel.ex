defmodule GameOfDotsWeb.GamesChannel do
  use GameOfDotsWeb, :channel
  alias GameOfDots.Game
  alias GameOfDots.BackupAgent

  def join("games:" <> name, payload, socket) do
    IO.inspect(payload)
    if authorized?(payload) do
      table_name = Map.get(payload, "tablename")
      user_name = Map.get(payload, "username")
      length = Map.get(payload, "length")
      breadth = Map.get(payload, "breadth")
      create_table = Map.get(payload, "createTable")
      IO.puts("create table")
      IO.inspect(create_table)
      game = BackupAgent.get(name) || Game.new(table_name, user_name, length, breadth)
      if create_table == false do
        players = game.players
        IO.inspect(players)
        new_players = players ++ [user_name]
        IO.inspect(new_players)
        game = %{game | players: new_players} 
        IO.inspect(game)
      end
      BackupAgent.put(name, game)
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
