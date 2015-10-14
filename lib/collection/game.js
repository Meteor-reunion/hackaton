Games = new Meteor.Collection("game");

GamesSchema = new SimpleSchema({
  bullets: {
    type: [Number],
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true
  },
  startedAt: {
    type: Date,
    optional: true
  },
  endedAt: {
    type: Date,
    optional: true
  },
  timer: {
    type: Number,
    optional: true
  },
  players:{
        type: [Object],
        maxCount: 2,
        optional: true
    },
    "players.$.userId": {
        type: String
    },
    "players.$.score": {
        type: Number,
        optional: true
    }
});

Games.attachSchema(GamesSchema);
