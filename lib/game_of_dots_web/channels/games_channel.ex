defmodule GameOfDotsWeb.GamesChannel do
  use GameOfDotsWeb, :channel
  alias GameOfDots.Game
  alias GameOfDots.BackupAgent

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      table_name = Map.get(payload, "tablename")
      user_name = Map.get(payload, "username")
      length = Map.get(payload, "length")
      breadth = Map.get(payload, "breadth")
      create_table = Map.get(payload, "createTable")
      capacity = Map.get(payload, "capacity")
      watch_table = Map.get(payload, "watchGame")

      if watch_table == true do
        game = BackupAgent.get(name)

        socket =
          socket
          |> assign(:game, game)
          |> assign(:name, name)

        {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
      else
        game = BackupAgent.get(name) || Game.new(table_name, user_name, length, breadth, capacity)

        if create_table == false do
          game = Game.add_player(game, user_name)
          BackupAgent.put(name, game)
        else
          BackupAgent.put(name, game)
        end

        game = BackupAgent.get(name)

        socket =
          socket
          |> assign(:game, game)
          |> assign(:name, name)

        {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
      end
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("send-msg", %{"input" => msg, "name" => name, "user" => user}, socket) do
    game = BackupAgent.get(name)
    game = Game.append_msg(game, msg, user)
    BackupAgent.put(name, game)
    IO.puts("heyyy")

    socket =
      socket
      |> assign(:game, game)

    broadcast!(socket, "sendmessage", %{"game" => Game.client_view(game)})
    {:noreply, socket}
    #
    # {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  def handle_in("draw", %{"name" => name, "input" => line, "user" => user}, socket) do
    game = BackupAgent.get(name)
    IO.inspect(game)
    game = Game.draw(game, line, user)
    IO.inspect(game)
    BackupAgent.put(name, game)

    socket =
      socket
      |> assign(:game, game)

    broadcast!(socket, "gamechanged", %{"game" => Game.client_view(game)})
    {:noreply, socket}
    # {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  def handle_in("start-game", %{"name" => name, "user" => user}, socket) do
    game = BackupAgent.get(name)
    IO.inspect(game)
    game = Game.startGame(game, user)
    IO.inspect(game)
    BackupAgent.put(name, game)

    socket =
      socket
      |> assign(:game, game)

    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_in("reset-game", %{"name" => name, "user" => user}, socket) do
    game = BackupAgent.get(name)
    IO.inspect(game)
    game = Game.resetGame(game, user)
    IO.inspect(game)
    BackupAgent.put(name, game)

    socket =
      socket
      |> assign(:game, game)

    broadcast!(socket, "gamechanged", %{"game" => Game.client_view(game)})
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
