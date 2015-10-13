ServiceConfiguration.configurations.remove({
  service: "facebook"
});

ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: Meteor.settings.facebook.APP_ID,
  secret: Meteor.settings.facebook.secret
});
