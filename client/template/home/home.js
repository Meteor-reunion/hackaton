Template.home.events({
  'click .joinGame': function (event) {
    Meteor.call('joinGame', function(err, game) {
      Session.set('currentGame', game)
    })
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
    //console.log(userId)
    if (user = Users.findOne({ _id: userId })) {
      //console.log(user)
      return user.profile.name
    } else {
      return "Utiliseur inconnu"
    }
  },

  rank: function(userId) {
    if (user = Users.findOne({ _id: userId })) {
      return user.profile.rank
    } else {
      return "?"
    }
  },

  gameInProgress: function(game) {
    return game.startedAt && !game.endedAt
  }
});

Template.game.events({
  'click .bullet': function (event) {
    Meteor.call('sendPosition', Session.get('currentGame'), $(event.target).attr('data-position'))
  },

  'click .replay': function (event) {
    Meteor.call('joinGame', function(err, game) {
      Session.set('currentGame', game)
    })
  },

  'click .bullet.value1': function(event) {
    catSound.get() && catSound.get().play()
  },

  'click .bullet.value0': function(event) {
    poopSound.get() && poopSound.get().play()
  }
});

Template.game.onRendered(function() {
  catSound.set(new Howl({urls: ['/cat.mp3']}))
  poopSound.set(new Howl({urls: ['/poop.mp3']}))
})
