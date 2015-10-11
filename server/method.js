function userName() {
  return Meteor.user().username || Meteor.user().profile.name;
}

function resetBullets() {
  var bullets = []
  for (var i = 0; i < 16; i++) {
    bullets.push(catOrPoop(0.3))
  }
  return bullets
}

function catOrPoop(luck) {
  return Math.random() < luck ? 0 : 1
}

Meteor.methods({
  joinGame: function() {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    var games = Games.find({ startedAt: null }).fetch()
    var alreadyInPendingGame
    games.forEach(function(game) {
      alreadyInPendingGame = game.players.filter(function(player, index){
        if (player.userId == this.userId) {
          return true
        }
      })
    })

    if (alreadyInPendingGame && alreadyInPendingGame.length > 0) {
      return alreadyInPendingGame[0]._id
    }

    var game = games[0]
    var gameId
    if (game) {
      Games.update({ _id: game._id }, {
        $push: { players: { userId: this.userId, score: 0 } },
        $set: { startedAt: new Date() }
      })
      gameId = game._id
      Meteor.call('sendTimer', gameId)
    } else {
      gameId = Games.insert({
        bullets: resetBullets(),
        players: [ { userId: this.userId,
                     score: 0 } ]
      })
    }
    return gameId
  },

  sendPosition: function(gameId, position) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    if (!position) {
      throw new Meteor.Error("Position is required")
    }

    var game = Games.findOne({ _id: gameId })

    if (!game.endedAt) {

      // update bullet value for the given position
      if (game) {
        var playerIndex
        game.players.forEach(function(player, index) {
          if (player.userId == this.userId) {
            playerIndex = index
          }
        }, this)

        if (playerIndex == undefined) {
          console.log('! Player '+this.userId+' is not in game '+gameId)
          throw new Meteor.Error("not-authorized");
        }

        var playerIncrement = 0
        if (game.bullets[position] == 1) {
          playerIncrement = 100
          console.log('+1')
        } else {
          playerIncrement = -200
          console.log('-1')
        }

        var setQuery = {}
        setQuery['bullets.'+position] = catOrPoop(0.5)

        var incQuery = {}
        incQuery['players.'+playerIndex+'.score'] = playerIncrement

        Games.update({ _id: gameId }, {
          $set: setQuery,
          $inc: incQuery
        })

        var editedGame = Games.findOne({ _id: gameId })
        if (editedGame.bullets.indexOf(1) < 0) {
          Games.update({ _id: gameId }, {
            $set: { bullets: resetBullets() }
          })
        }
      } else {
        console.log('Player '+this.userId+' is not in game '+gameId)
        throw new Meteor.Error("not-authorized");
      }

    } else {
      console.log('La partie est terminée, les envois ne sont plus pris en charge')
    }
  },

  sendTimer: function(gameId) {
    var game = Games.findOne({ _id: gameId })
    var timer = game.timer || 30
    var interval = Meteor.setInterval(function() {
      timer--
      console.log(timer)
      Games.update({ _id: gameId }, {
        $set: { timer: timer }
      })
      if (timer <= 0) {
        Meteor.clearInterval(interval)
        Meteor.call('endGame', gameId)
      }
    }, 1000)
  },

  endGame: function(gameId) {
    var game = Games.findOne({ _id: gameId })
    Games.update({ _id: gameId }, {
      $set: { endedAt: new Date() }
    })

    var bestPlayerId
    var bestPlayerScore = -1000000
    console.log(game.players)
    game.players.forEach(function(player) {
      console.log('player.userId: '+player.userId)
      console.log('player.score: '+player.score)
      if (player.score > bestPlayerScore) {
        bestPlayerId = player.userId
        bestPlayerScore = player.score
      }
    })
    console.log('bestPlayerId: '+bestPlayerId)

    Meteor.call('updatePlayerSubRank', bestPlayerId)
  },

  updatePlayerSubRank: function(playerId) {
    Users.update({ _id: playerId }, {
      $inc: { 'profile.subRank': 1000 }
    })

    console.log(playerId)
    updatedUser = Users.findOne({ _id: playerId })
    console.log('updatedUser')
    console.log(updatedUser)
    var maxPerSubRank = 1900 // 10000
    if (updatedUser.profile.subRank >= maxPerSubRank) {
      Users.update({ _id: playerId }, {
        $inc: { 'profile.subRank': -maxPerSubRank, 'profile.rank': 1 }
      })
    }
  }
})
