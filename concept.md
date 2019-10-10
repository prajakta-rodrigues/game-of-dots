if currentGameState.isWin():
          return float("inf")
        elif currentGameState.isLose():
          return float("-inf")
        
        pos = currentGameState.getPacmanPosition()
        """
        Number of Food left
        """
        numFood = currentGameState.getNumFood()

        """
        Number of capsules left
        """
        numCapsule = len(currentGameState.getCapsules())

        score = 0
        if currentGameState.getNumFood() > successorGameState.getNumFood():
          score += 100
        
        """
        Now we will find the distance to the closest food
        """
        closestDist = float("inf")
        foodList = newFood.asList()
        for food in foodList:
          currentDistance = util.manhattanDistance(food, pos)
          if currentDistance < closestDist:
            closestDist = currentDistance

        scaredGhosts = []
        ghosts = []
        for ghost in currentGameState.getGhostStates():
          if not ghost.scaredTimer:
            ghosts.append(ghost.getPosition())
          else:
            scaredGhosts.append(ghost.getPosition())

        print scaredGhosts
        print ghosts
        """
        Now we will find the distance to the closest scared ghost
        """
        closestScaredGhostDist = float("inf")
        for scaredGhost in scaredGhosts:
          currentDist = util.manhattanDistance(scaredGhost, pos)
          if currentDist < closestScaredGhostDist:
            closestScaredGhostDist = currentDist
        """
        Now we will find the distance to the closest ghost
        """
        closestGhostDist = float("inf")
        for ghost in ghosts:
          currDist = util.manhattanDistance(ghost, pos)
          print currDist
          if currDist < closestGhostDist:
            closestGhostDist = currDist

        score = -2 * closestDist - 2 * (1./closestGhostDist) - 2 * numFood
        - 20 * numCapsule

        # new_score = -1.5 * closestDist + \
        #   -2    * (1./closestGhostDist) + \
        #   -2    * closestScaredGhostDist + \
        #   -20 * numCapsule + \
        #   -4    * numFood + scoreEvaluationFunction(currentGameState)

        return score