Users = Meteor.users;

UserProfileSchema = new SimpleSchema({
  name: {
    type: String,
    label: "Full Name",
    max: 64,
    optional: true
  },
  online: {
    type: Boolean,
    defaultValue: false
  },
  rank: {
    type: Number,
    optional: true,
    defaultValue: 1
  },
  subRank: {
    type: Number,
    optional: true,
    defaultValue: 0
  }
});

UserSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  username: {
    type: String,
    optional: true
  },
  emails: {
    type: [Object],
    // this must be optional if you also use other login services like facebook,
    // but if you use only accounts-password, then it can be required
    optional: true
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "Email Address"
  },
  "emails.$.verified": {
    type: Boolean,
    defaultValue: false
  },
  emailHash: {
    type: String,
    optional: true
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: UserProfileSchema,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: Array,
    optional: true
  },
  "roles.$": {
    type: String
  }
});

Users.attachSchema(UserSchema);
