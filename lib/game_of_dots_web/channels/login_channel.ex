defmodule GameOfDotsWeb.LoginChannel do
    use GameOfDotsWeb, :channel
    alias GameOfDots.Login
    alias GameOfDots.BackupAgent


    def join("login:" <> name, payload, socket) do
        if authorized?(payload) do
          game = BackupAgent.get(name) || Login.new()
          BackupAgent.put(name, game)
          socket = socket
          |> assign(:game, game)
          |> assign(:name, name)
          {:ok, %{"join" => name, "game" => Login.client_view(game)}, socket}
        else
          {:error, %{reason: "unauthorized"}}
        end
      end
    
    def handle_in("add_table", %{"table" => table}, socket) do
        name = socket.assigns[:name]
        game = Login.add_table(socket.assigns[:game], table)
        socket = assign(socket, :game, game)
        BackupAgent.put(name, game)
        broadcast! socket, "addtab", %{"game" => Login.client_view(game)}
        {:noreply, socket}
        # {:reply, {:ok, %{ "game" => Login.client_view(game)}}, socket}
    end

    def handle_in("join_table", %{"table_name" => table_name, "player_name" => player_name}, socket) do
      name = socket.assigns[:name]
      game = Login.join_table(socket.assigns[:game], table_name, player_name)
      socket = assign(socket, :game, game)
      BackupAgent.put(name, game)
      broadcast! socket, "jointab", %{"game" => Login.client_view(game)}
      {:noreply, socket}
      # {:reply, {:ok, %{ "game" => Login.client_view(game)}}, socket}
    end

    # Add authorization logic here as required.
    defp authorized?(_payload) do
        true
    end
end
