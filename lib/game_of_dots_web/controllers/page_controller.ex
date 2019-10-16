defmodule GameOfDotsWeb.PageController do
  use GameOfDotsWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

end
