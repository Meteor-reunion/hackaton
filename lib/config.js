T9n.setLanguage('fr');

AccountsTemplates.configure({
    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: true,
    lowercaseUsername: true,
    enforceEmailVerification: false,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: false,
    showPlaceholders: true,

    // Client-side Validation
    continuousValidation: false,
    negativeValidation: false,
    negativeFeedback: false,
    positiveValidation: false,
    positiveFeedback: false,
    showValidating: true,

    // Privacy Policy and Terms of Use
    //privacyUrl: 'privacy',
    //termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,
});

AccountsTemplates.configureRoute('signIn',{template: 'myLogin',layoutTemplate: 'layout'});
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('verifyEmail');
AccountsTemplates.configureRoute('resendVerificationEmail');



AccountsTemplates.addField({
    _id: "username",
    type: "text",
    displayName: T9n.get('username'),
    placeholder: {
        signUp: T9n.get('username'),
        signIn: T9n.get('username'),
    },
    required: true,
    minLength: 3,
    trim: true,
    errStr: 'error.minChar'
});

Avatar.setOptions({
  fallbackType: 'initials',
  gravatarDefault: 'identicon'
  //emailHashProperty: "emailHash"
  //defaultImageUrl: 'img/avatar.jpg'
});


