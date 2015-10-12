Template.home.events({
  'click .joinGame': function (event) {
    Meteor.call('joinGame', function(err, game) {
      Session.set('currentGame', game)
    })
  },

  'click h1.title': function(event) {
    //TODO leave game and redirect to home
  }
});


Template.home.helpers({
  currentGame: function () {
    return Session.get('currentGame');
  }
});

Template.game.helpers({
  game: function () {
    return Games.findOne({});
  },

  timer: function() {
    var game = Games.findOne({})
    return game.timer || '30'
  },

  username: function(userId) {
    if (user = Users.findOne({ _id: userId })) {
      return user.profile.name
    } else {
      return "Waiting for a player..." //TODO use i18n
    }
  },

  rank: function(userId) {
    if (user = Users.findOne({ _id: userId })) {
      return "("+user.profile.rank+")"
    } else {
      return ""
    }
  },

  gameInProgress: function(game) {
    var gameInProgress = game.startedAt && game.timer > 0
    if (Session.get('gameInProgress') != gameInProgress) {
      Session.set('gameInProgress', gameInProgress)
    }
    return gameInProgress
  }
});

Template.game.events({
  'click .bullet .bullet-image': function (event) {
    Meteor.call('sendPosition', Session.get('currentGame'), $(event.target).closest('.bullet').attr('data-position'))
  },

  'click .replay': function (event) {
    Meteor.call('joinGame', function(err, game) {
      Session.set('currentGame', game)
    })
  },

  'click .bullet.value1': function(event) {
    // if (kickSound.get()) {
    //   kickSound.get().stop()
    //   kickSound.get().play(Math.floor(Math.random() * 4) + 1) // random number between 1 and 4
    // }
  },

  'click .bullet.value0': function(event) {
    poopSound.get() && poopSound.get().play()
  }
});

Template.game.onRendered(function() {
  kickSound.set(new Howl({
    urls: ['/sounds/kicks.mp3'],
    sprite: {
      1: [100, 700],
      2: [1400, 400],
      3: [3500, 550],
      4: [5600, 700]
    }
  }))
  poopSound.set(new Howl({urls: ['/sounds/poop.mp3']}))

  this.autorun(function () {
    if (Session.get('gameInProgress') == true) {
      new Howl({urls: ['/sounds/start.mp3']}).play()
    } else {
      //console.log("la partie n'a pas encore commencé")
    }
  })
})
