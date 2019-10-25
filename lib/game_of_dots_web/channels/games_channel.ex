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
        game = Game.add_player(game, user_name)
        IO.inspect(game)
        BackupAgent.put(name, game)
      else
        BackupAgent.put(name, game)
      end
      game = BackupAgent.get(name)
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
