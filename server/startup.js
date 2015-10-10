    Meteor.startup(function () {
      var users = [
        { username: "john",
          emails: [ { address: "john@example.com", verified: true }],
          profile: { name: "John Doe" }
        },
        {
          username: "admin",
          emails: [ { address: "admin@example.com", verified: true }],
          profile: { name: "Admin" }
        }
      ]

      _.each(users, function (user) {
        try {
          Accounts.createUser(user)
        } catch (e) {
          console.log(user.username+' already created');
        }
      })

      var user = Users.findOne({ username: "john" })
      console.log(user)
      var games = [
        {
          bullets: [1, 1, 1, 0,
                    1, 0, 1, 1,
                    1, 1, 0, 0,
                    1, 1, 0, 1],
          players: [ { userId: user._id,
                       score: 0 } ]
        }
      ]

      _.each(games, function (game) {
        Games.insert(game)
      })
    });
