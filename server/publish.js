Meteor.publish(null, function (){
  return Meteor.roles.find({})
})

Meteor.publish('game', function() {
	if (!this.userId) {
   return;
    }
    //filter userId
    return Games.find({});
});

Meteor.publish('allUser', function() {
	if (!this.userId) {
   return;
    }
    return Meteor.users.find({}, {
        fields: {
            'profile': 1,
            'username': 1,
            'services.facebook.id': 1,
            'emailHash': 1,
            'emails': 1,
        }
    });
});

Meteor.publish('singleUser', function() {
	if (!this.userId) {
   return;
    }
    return Meteor.users.find({
        _id: this.userId
    }, {
        fields: {
            'profile': 1,
            'username': 1,
            'services.facebook.id': 1,
            'emailHash': 1,
            'emails': 1,
        }
    });
});


Meteor.publish('up', function(gameId) {
  check(gameId, String);
	if (!this.userId) {
   return;
    }
    return Games.find({
        'players.userId':this.userId
    }, {
      $inc: {
      "players.score": +1
      }
  });
});


Meteor.publish('down', function(gameId) {
    check(gameId, String);
	if (!this.userId) {
   return;
    }
    return Games.find({
        'players.userId':this.userId
    }, {
      $inc: {
      "players.score": -1
          }
      });
});
