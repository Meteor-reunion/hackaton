function userName() {
    return Meteor.user().username || Meteor.user().profile.name;
}

Meteor.methods({
    deleteResto: function(restoId) {
        check(restoId, String);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
                if (Roles.userIsInRole(this.userId, ['restaurateur']) && this.userId==Restos.findOne({_id:restoId}).userId) {
                	  Restosimg.remove({_id:Restos.findOne(restoId).urlimage});
                    Restos.remove(restoId);
                    Cartes.remove({'restoId':restoId});
                    var urlimages=Cartes.find({'restoId':restoId}).map(function(p) {
                    return p.urlimage;
                });
                	Restosimg.remove({_id:{$in:urlimages}});
                }else if(Roles.userIsInRole(this.userId, ['admin'])){
                	Restosimg.remove({_id:Restos.findOne(restoId).urlimage});
                	Restos.remove(restoId);
                	Cartes.remove({'restoId':restoId});
                	var urlimages=Cartes.find({'restoId':restoId}).map(function(p) {
                    return p.urlimage;
                });
                	Restosimg.remove({_id:{$in:urlimages}});
                	}
     },
    deleteOffre: function(offreId) {
        check(offreId, String);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
                if (Roles.userIsInRole(this.userId, ['restaurateur']) && this.userId==Offres.findOne({_id:offreId}).userId) {
                    Offres.remove(offreId);
                }else if (Roles.userIsInRole(this.userId, ['admin'])){
                	Offres.remove(offreId);
                	}
     },
	commandeStatus: function(commandeId,status){
		check(commandeId, String);
		console.log("commande id:", commandeId);
		       if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        if (Roles.userIsInRole(this.userId, ['restaurateur'])) {

				Commandes.update({_id:commandeId},{$set:{'status':status}});
				 var userIds = Commandes.find({_id:commandeId}).map(function(p) {
                    return p.userId;
                });

                if(status=='active'){
                  //si active doit enlever les elements de la commandes du stock lier quantity Quantity
var offreIds=Commandes.findOne({_id:commandeId}).commande.map(function(p) {
  Offres.update({_id:p.offreId},{ $inc : {quantity : -p.Quantity} });
                    return p.offreId;
                });
  //doit verifier si d'autre commande encours
  var soldoutNotif=[]
  Offres.find({_id:{$in:offreIds}}).map(function(p) {
    if(p.quantity<1){
        Commandes.update({'commande.offreId':p._id,status:'pending'},{ $set : {status : 'soldout'} },{multi:true});
      Commandes.update({'commande.offreId':p._id,status:'flagged'},{ $set : {status : 'soldout'} },{multi:true});
      Offres.update({_id:p._id},{$set:{status:'completed'}});
      //soldout notif
      Commandes.find({'commande.offreId':p._id,status:'soldout'}).map(function(c) {
      				        Push.send({
                        from: 'push',
                        title: 'Offre épuisé',
                        text: 'Offre épuisé commande annulé',
                        payload: {
                            title: 'Offre épuisé commande annulé',
                            commandeId: c._id,
                            pushType: 'commande'
                        },
                        query: {
                            userId: c.userId
                        }
                    });
      });
    }else if(p.quantity>0){
      Commandes.update({'commande.offreId':p._id,'commande.Quantity':{$gt:p.quantity},status:'pending'},{ $set : {status : 'flagged'} },{multi:true});
      //flagged
      Commandes.find({'commande.offreId':p._id,status:'flagged'}).map(function(c) {
                		Push.send({
                        from: 'push',
                        title: 'Commande probléme',
                        text: 'Commande probléme',
                        payload: {
                            title: 'Votre ne peut être traité',
                            commandeId: c._id,
                            pushType: 'commande'
                        },
                        query: {
                            userId: c.userId
                        }
                    });
    });
    }
                    return p._id;
                });

                }else if(status=='soldout'){

                }else if(status=='ok'){

                }else if(status=='completed'){

                }else if(status=='flagged'){

                }


                console.log("commande id:", userIds);
                Push.debug = true;
                if(status=='active'){
                		Push.send({
                        from: 'push',
                        title: 'Commande prête',
                        text: 'Votre commande est prête',
                        payload: {
                            title: 'Votre commande est prête',
                            commandeId: commandeId,
                            pushType: 'commande'
                        },
                        query: {
                            userId: {
                                $in: userIds
                            }
                        }
                    });
                }else if(status=='soldout'){
				        Push.send({
                        from: 'push',
                        title: 'Offre épuisé',
                        text: 'Offre épuisé commande annulé',
                        payload: {
                            title: 'Offre épuisé commande annulé',
                            commandeId: commandeId,
                            pushType: 'commande'
                        },
                        query: {
                            userId: {
                                $in: userIds
                            }
                        }
                    });
                }else if(status=='ok'){

                }else if(status=='completed'){
				        Push.send({
                        from: 'push',
                        title: 'Commande terminée',
                        text: 'Votre commande est terminée',
                        payload: {
                            title: 'Votre commande est terminée',
                            commandeId: commandeId,
                            pushType: 'commande'
                        },
                        query: {
                            userId: {
                                $in: userIds
                            }
                        }
                    });
                }else if(status=='flagged'){
                		Push.send({
                        from: 'push',
                        title: 'Commande probléme',
                        text: 'Commande probléme',
                        payload: {
                            title: 'Votre commande ne peut être traité',
                            commandeId: commandeId,
                            pushType: 'commande'
                        },
                        query: {
                            userId: {
                                $in: userIds
                            }
                        }
                    });
                }


        }else{
        	throw new Meteor.Error("not-authorized");
        	}
	},
  offrepush:function(offreId){
    //check(latLng, {longitude:Number,latitude:Number});
    	check(offreId, String);
            if (!this.userId || !Roles.userIsInRole(this.userId, ['restaurateur'])) {
            throw new Meteor.Error("not-authorized");
        }
    var radius = 2500;
    var restoOne = Restos.findOne({_id:Offres.findOne({_id:offreId}).restoId});
    var coordinates = restoOne.loc.coordinates;

                  Meteor.users._ensureIndex({
                    "profile.loc": "2dsphere"
                });
                var usernoti = Meteor.users.find({
                    "profile.loc": {
                        $nearSphere: {
                            $geometry: {
                                type: "Point",
                                coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])]
                            },
                            $maxDistance: radius
                        }
                    },
                    "_id": {
                        $ne: this.userId
                    }
                }, {
                    fields: {
                        _id: 1
                    }
                });
                var userIds = usernoti.map(function(p) {
                    return p._id
                });
                   console.log('push user ' + JSON.stringify(userIds));
                    if (userIds.length > 0) {
                    Push.send({
                        from: 'push',
                        title: 'Nouvelle offre',
                        text: 'Nouvelle offre',
                        payload: {
                            title: 'Nouvelle offre',
                            offreId: offreId,
                            restoId: restoOne.restoId,
                            pushType: 'offre'
                        },
                        query: {
                            userId: {
                                $in: userIds
                            }
                        }
                    });
                }


  },
	commande: function(restoId){
		check(restoId, String);
		       if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
				console.log("Resto id:", restoId);
    //doit verifier que la commande est possible
		    var Items = Cart.find({restoId:restoId,userId:this.userId});
		    var arritem=[];
		    var Sum = 0;
    Items.forEach(function(Item){
    	console.log("Items:",Item.Name);
    	Sum += Item.Price * Item.Quantity;
        arritem.push({Name:Item.Name,Price:Item.Price,Tva:Item.Tva,Quantity:Item.Quantity,offreId:Item.offreId});
         Cart.remove({_id:Item._id});
    });
    var commandeId=Commandes.insert({restoId:restoId,commande:arritem,Total:Sum});
    				 var userIds = Restos.find({_id:restoId}).map(function(p) {
                    return p.userId;
                });
                Push.debug = true;
                		Push.send({
                        from: 'push',
                        title: 'Nouvelle commande',
                        text: 'Nouvelle commande',
                        payload: {
                            title: 'Nouvelle commande de '+userName(),
                            commandeId: commandeId,
                            pushType: 'commande'
                        },
                        query: {
                            userId: {
                                $in: userIds
                            }
                        }
                    });

       return commandeId;
	},
    restoup: function(restoId,geo) {
    	check(geo, {longitude:Number,latitude:Number});
      		check(restoId, String);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
      if (Roles.userIsInRole(this.userId, ['restaurateur'])) {
        if (Restos.update({
          _id: restoId,
          userId:this.userId,
            }, {
                $set: {
                    'loc': {
                        type: "Point",
                        'coordinates': [parseFloat(geo.longitude), parseFloat(geo.latitude)]
                    }
                }
            })) {
            console.log('update user web geo' + JSON.stringify({
                latitude: parseFloat(geo.latitude),
                longitude: parseFloat(geo.longitude)
            }));
            return true;
        } else {
            console.log('error update user web geo' + JSON.stringify({
                latitude: parseFloat(geo.latitude),
                longitude: parseFloat(geo.longitude)
            }));
            return false;
        }
        this.unblock();
      }else{
        throw new Meteor.Error("not-authorized");
      }
    },
    userup: function(geo) {
    	check(geo, {longitude:Number,latitude:Number});
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        if (Meteor.users.update({
                _id: this.userId
            }, {
                $set: {
                    'profile.loc': {
                        type: "Point",
                        'coordinates': [parseFloat(geo.longitude), parseFloat(geo.latitude)]
                    }
                }
            })) {
            console.log('update user web geo' + JSON.stringify({
                latitude: parseFloat(geo.latitude),
                longitude: parseFloat(geo.longitude)
            }));
            return true;
        } else {
            console.log('error update user web geo' + JSON.stringify({
                latitude: parseFloat(geo.latitude),
                longitude: parseFloat(geo.longitude)
            }));
            return false;
        }
        this.unblock();
    },
    settingRadius: function(radius) {
    	check(radius, Number);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        if (Meteor.users.update({
                _id: this.userId
            }, {
                $set: {
                    type: "Number",
                    'profile.radius': parseInt(radius)
                }
            })) {
            console.log('update radius web geo' + JSON.stringify(parseInt(radius)));
            return true;
        } else {
            console.log('error update radius web geo' + JSON.stringify(parseInt(radius)));
        }
    },
    settingNotifications: function(notifications) {
    	check(notifications, Boolean);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        if (Meteor.users.update({
                _id: this.userId
            }, {
                $set: {
                    type: "Boolean",
                    'profile.notifications': notifications
                }
            })) {
            console.log('update notifications ' + JSON.stringify(notifications));
            return true;
        } else {
            console.log('error update notifications ' + JSON.stringify(notifications));
        }
    },
    geoinsert: function(requestData) {
    	  check(requestData, Match.Any);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        if (GeoLog.insert(requestData)) {
            return true;
        }
    },
    pushphoto: function(latLng,photoId) {
    	//check(latLng, {longitude:Number,latitude:Number});
    	check(photoId, String);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
                    var userradius = Meteor.users.findOne({
                    _id: this.userId
                }, {
                    fields: {
                        "profile.radius": 1
                    }
                });

                var userfriends = Meteor.users.findOne({
                    _id: this.userId,
                    'profile.friends.status':'friend'
                }, {
                    fields: {
                        "profile.friends": 1
                    }
                });

                if(userradius && userradius.profile && userradius.profile.radius){
                var radius = parseInt(userradius.profile.radius);
                	}else{
                     var radius = 25000;
                    console.log('push radius default ' + JSON.stringify(radius));
                		}

                if(userfriends && userfriends.profile && userfriends.profile.friends){
                var favoris = userfriends.profile.friends.map(function(p) {
                    return p._id
                });
                console.log('push favoris ' + JSON.stringify(favoris));
                	}else{
                		var favoris = [];
                		}

                Meteor.users._ensureIndex({
                    "profile.loc": "2dsphere"
                });
                var usernoti = Meteor.users.find({
                    "profile.loc": {
                        $nearSphere: {
                            $geometry: {
                                type: "Point",
                                coordinates: [latLng.lng, latLng.lat]
                            },
                            $maxDistance: radius
                        }
                    },
                    "profile.notifications": true,
                    "_id": {
                        $ne: this.userId
                    }
                }, {
                    fields: {
                        _id: 1
                    }
                });
                var userIds = usernoti.map(function(p) {
                    return p._id
                });

                var mergedId = _.union( userIds, favoris);
                console.log('push user ' + JSON.stringify(userIds));
                console.log('push mergedId ' + JSON.stringify(mergedId));
                Push.debug = true;
                if (userIds.length > 0) {
                    Push.send({
                        from: 'push',
                        title: 'Nouvelle photo',
                        text: 'Nouvelle photo de ' + userName(),
                        payload: {
                            title: 'Nouvelle photo',
                            photoId: photoId,
                            pushType: 'photo'
                        },
                        query: {
                            userId: {
                                $in: userIds
                            }
                        }
                    });
                }
    },
    cfsbase64tos3up: function(photo,str) {
    	  check(photo, Match.Any);
    	  check(str, Match.Any);
        if (!this.userId) {
            throw new Meteor.Error("not-authorized");
        }
        if (Roles.userIsInRole(this.userId, ['restaurateur'])) {

    var fsFile = new FS.File();
    fsFile.attachData(photo,{'type':'image/jpeg'});
    fsFile.extension('jpg');
    fsFile.name(str);
    fsFile.metadata = {owner: this.userId};
    fsFile.on('error', function () {
    	console.log("There was a problem storing ");
    	});
    fsFile.on("uploaded", function () {
    	console.log("Done uploading!");
  });

    var photoret=Restosimg.insert(fsFile);
    console.log('photoret ' + photoret._id);
    console.log("Done uploading ");
    return photoret._id;
        }else{
            throw new Meteor.Error("not-authorized");
        }
    },
   search: function(query, options) {
            options = options || {};

            // guard against client-side DOS: hard limit to 50
            if (options.limit) {
                options.limit = Math.min(50, Math.abs(options.limit));
            } else {
                options.limit = 50;
            }
console.log("query "+query);
            // TODO fix regexp to support multiple tokens
            var regex = new RegExp("^" + query);
            return Meteor.users.find({username: {$regex:  regex}}, options).fetch();
        }


});