defmodule GameOfDots.Login do

    def new() do
      %{
        tables: []
      }
    end

    def client_view(game) do
        game
      end
    
    def add_table(game, table) do
        new_table = [table]
        tables = Map.get(game, :tables)
        updated_tables = tables ++ new_table
        game = %{game | tables: updated_tables}
    end
end