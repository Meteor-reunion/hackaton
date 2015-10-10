ServiceConfiguration.configurations.remove({
service: "facebook"
});

ServiceConfiguration.configurations.insert({
service: "facebook",
appId: Meteor.settings.facebook.APP_ID,
secret: Meteor.settings.facebook.secret
});
/*
AWS.config.update({
accessKeyId: Meteor.settings.aws.access_key,
secretAccessKey: Meteor.settings.aws.secret,
region: Meteor.settings.aws.region
});
*/