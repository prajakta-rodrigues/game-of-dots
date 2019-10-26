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

      if watch_table == true  do
        game = BackupAgent.get(name)
        socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
      else
        game = BackupAgent.get(name) || Game.new(table_name, user_name, length, breadth, capacity)
        if create_table == false do
          players = game.players
          
          game = Game.add_player(game, user_name)
          
          
          BackupAgent.put(name, game)
        else
          BackupAgent.put(name, game)
        end
        game = BackupAgent.get(name)

        socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
      end
      
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("send_msg", %{"msg" => msg}, socket) do
    name = socket.assigns[:name]
    game = Game.append_msg(socket.assigns[:game], msg)
    socket = assign(socket, :game, game)
    broadcast! socket, "sendmsg", %{game => game}
    {:noreply, socket}
    BackupAgent.put(name, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
