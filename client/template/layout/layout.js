

  Template.layout.helpers({
      onPage: function (pageName) {
      return Router.current().route.getName() === pageName;
    }
   });
