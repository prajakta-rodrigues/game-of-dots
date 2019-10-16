#!/bin/bash

export MIX_ENV=prod
export PORT=3222

echo "Starting app..."


# Foreground for testing and for systemd
_build/prod/rel/game-of-dots/bin/game-of-dots start
