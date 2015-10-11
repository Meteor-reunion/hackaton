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
    return game.timer
  },

  username: function(userId) {
    console.log(userId)
    if (user = Users.findOne({ _id: userId })) {
      console.log(user)
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
  }
});

Template.game.events({
  'click .bullet': function (event) {
    Meteor.call('sendPosition', Session.get('currentGame'), $(event.target).attr('data-position'))
  }
});
