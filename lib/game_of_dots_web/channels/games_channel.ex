defmodule GameOfDotsWeb.GamesChannel do
  use GameOfDotsWeb, :channel
  alias GameOfDots.Game
  alias GameOfDots.BackupAgent

  def join("games:" <> name, payload, socket) do
    IO.inspect(payload)
    if authorized?(payload) do
      table_name = Map.get(payload, "tableName")
      user_name = Map.get(payload, "userName")
      game = BackupAgent.get(name) || Game.new(table_name, user_name)
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
