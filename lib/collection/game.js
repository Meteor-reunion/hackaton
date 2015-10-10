Games = new Meteor.Collection("game");

GamesSchema = new SimpleSchema({
  // _id: {
  //   type: String,
  //   regEx: SimpleSchema.RegEx.Id
  // },
  bullets: {
    type: [Number]
  },  createdAt: {
    type: Date,
    optional: true
  },
  endedAt: {
    type: Date,
    optional: true
  },
  players:{
        type: [Object],
        minCount: 1,
        maxCount: 2
    },
    "players.$.userId": {
        type: String
    },
    "players.$.score": {
        type: Number
    }
});

Games.attachSchema(GamesSchema);
