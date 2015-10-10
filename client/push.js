Meteor.startup(function () {

	if (Meteor.isCordova) {
		window.alert = navigator.notification.alert;
	}

 Push.addListener('startup', function(notification) {

  if(notification.payload.pushType === 'commande'){
    Router.go('commande', {
     commandeId: notification.payload.commandeId
    });
  }
  else if(notification.payload.pushType === 'offre'){
    //offreDetail n'existe pas encore
    //il faudra recupere restoId pour que  le panier fonctionne session.set()
    Router.go('restoDetail', {
     _id: notification.payload.restoId
    });
  }
   else if(notification.payload.pushType === 'interest'){
    alert('not implemented yet');
  }
});

Push.addListener('message', function(notification) {
		// Called on every message
		function alertDismissed() {
 if(notification.payload.pushType === 'commande'){
    Router.go('commande', {
      commandeId: notification.payload.commandeId
    });
  }else if(notification.payload.pushType === 'offre'){
    Router.go('offreDetail', {
     _id: notification.payload.offreId
    });
  }
		}
		window.alert(notification.message, alertDismissed, notification.payload.title, "Ok");
	});
});