function userName() {
    return Meteor.user().username || Meteor.user().profile.name;
}

function catOrPoop() {
  return Math.random() < 0.5 ? 0 : 1
}

Meteor.methods({
  joinGame: function() {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    game = Games.find({ startedAt: null }).fetch()[0]
    var gameId
    if (game) {
      Games.update({ _id: game._id }, {
        $push: { players: { userid: this.userId, score: 0 } },
        $set: { startedAt: new Date() }
      })
      gameId = game._id
    } else {
      var bullets = []
      for (var i = 0; i < 16; i++) {
        bullets.push(catOrPoop())
      }
      gameId = Games.insert({
        bullets: bullets,
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

    var game = Games.findOne({ _id: gameId })

    // update bullet value for the given position
    if (game) {
      var playerIndex
      game.players.map(function(player, index){
        if (player.userId == this.userId) {
          playerIndex = index
        }
      })

      var playerIncrement = 0
      if (game.bullets[position] == 1) {
        playerIncrement = 1
      } else {
        playerIncrement = -1
      }

      var setQuery = {}
      setQuery['bullets.'+position] = catOrPoop()

      var incQuery = {}
      incQuery['players.'+playerIndex+'.score'] = playerIncrement

      console.log(setQuery)
      console.log(incQuery)
      Games.update({ _id: gameId }, {
        $set: setQuery,
        $inc: incQuery
      })
    } else {
      console.log('Player '+this.userId+' is not in game '+gameId)
      throw new Meteor.Error("not-authorized");
    }
  }
})
