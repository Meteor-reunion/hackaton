
Games.allow({
  insert: function(userId, doc) {
    return userId;
  },
  update: function(userId, doc, fieldNames, modifier) {
    return true;
  },
  remove: function(userId, doc) {
    return Roles.userIsInRole(userId, ['admin']);
  }
});
