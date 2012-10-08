 /*!
 * jQuery FB JSSDK Simplified
 * http://github.com/kh411d/jQuery-FB-JSSDK-Simplified
 *
 * Copyright 2012, Khalid Adisendjaja
 * Apache License 2.0
 * http://github.com/kh411d/jQuery-FB-JSSDK-Simplified
 */

 (function($){
 	var perms;
 	$.fn.fb = function(method,options){
 	
		if ( methods[method] ) {
	      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	      return methods.init.apply( this, arguments );
	    } else {
	      $.error( 'Method ' +  method + ' does not exist on jQuery.fb' );
	    }     
        
 	};

 	var methods = {
 		init: function(args){
 				if(!args.options.appId) {
            		return;
        		}	 
 				 var config = $.extend({},{
										status     : true, 
										cookie     : true,
										xfbml      : true,
										oauth      : true
								}, args.options);

				 perms = args.perms || 'publish_stream,email';
		 			
		 			window.fbApiInitalized = window.fbApiInitialized || false;

		 			window.fbAsyncInit = function() {
		 				window.fbApiInitialized = true;
		 				FB.init(config);
		 				FB.Canvas.scrollTo(0, 0);  
        				FB.Canvas.setAutoGrow(91);
			        }
			        
			        //Append fb-root div tag
			       if (!document.getElementById('fb-root')) {
						var e = document.createElement('div');
						e.id = 'fb-root';
						document.getElementsByTagName('body')[0].appendChild(e);
					}
			        
			        //Async Load JS SDK Script
					var js, id = 'facebook-jssdk', ref = document.getElementsByTagName('script')[0];
				     if (document.getElementById(id)) {return;}
				     js = document.createElement('script'); js.id = id; js.async = true;
				     js.src = "//connect.facebook.net/en_US/all.js";
				     ref.parentNode.insertBefore(js, ref);
			    
 		},
 		login : function(redirectURL){
							   redirectURL = redirectURL || "";
							   var callback = function(response){
											  		if (response.authResponse) { 
											  			window.top.location.href = redirectURL;
											  		} 							  
											  	};
							   if(redirectURL == "") callback = null;
							   this.click(function(){
							   	_EnsureInit(function(){
							   		FB.login(callback, {scope: perms});	
							   	});
							   });
							   
		},
		getLoginStatus : function(){
						_EnsureInit(function(){
							 FB.getLoginStatus(function(response) {
							  if (response.status === 'connected') {
							    // the user is logged in and has authenticated your
							    // app, and response.authResponse supplies
							    // the user's ID, a valid access token, a signed
							    // request, and the time the access token 
							    // and signed request each expire
							    var uid = response.authResponse.userID;
							    var accessToken = response.authResponse.accessToken;
							    var signedRequest = response.authResponse.signedRequest;
							    var expiresIn = response.authResponse.expiresIn;
							    return response.authResponse;
							  } else if (response.status === 'not_authorized') {
							    // the user is logged in to Facebook, 
							    // but has not authenticated your app
							    return false;
							  } else {
							    // the user isn't logged in to Facebook.
							    return false;
							  }
							 });
						});
							
		},
	   /* 
	   * To Own Wall:
	   * var jsonData =>  {name:'',caption:'{*actor*},description:'',picture:'',link:'',actions:[{ name: 'Get Started', link: 'http://apps.facebook.com/mobile-start/' }]}
	   *
	   * To Friend Wall
	   * var jsonData =>  {to:FRIEND ID,name:'',caption:'{*actor*},description:'',picture:'',link:'',user_message_prompt:'',actions:[{ name: 'Get Started', link: 'http://apps.facebook.com/mobile-start/' }]}
	   *
	   */
		feed : function(jsonData){
						var requestJSON = $.extend({method:'feed'},jsonData); 
						var callback = function(response){
										    if (response && response.post_id) {
																			  /*POST IS PUBLISHED*/
											} else {
																			  /*POST NOT PUBLISHED*/
											}
										  };
						_EnsureInit(function(){ 
						   FB.ui(requestJSON,callback);
						});
		},
	  /*
	   * TO RECIPIENTS : {message:"My Great Request",to:user_ids}
	   * TO MULTI RECIPIENTS : {message:"My Great Request"}
	   * TO MULTI RECIPIENTS DEFINED : {message:"My Great Request",suggestions: [uid1, uid2, uid3]}
	   */
		appRequests : function(jsonData){
						var requestJSON = $.extend({method:'apprequests'},jsonData); 
						var callback = function(response){
												if (response && response.request_ids) {
													var requests = response.request_ids.join(',');
													/*TO DO : AJAX POST REQUEST TO KEEP REQUEST ON DATABASE*/
												} else {
													alert('canceled');
												}									
									   }
						this.click(function(){			   
							_EnsureInit(function(){
						       FB.ui(requestJSON,callback);
						    });
						});
		},
		/* event :
		* auth.login -- fired when the user logs in
	    * auth.logout -- fired when the user logs out
	    * auth.sessionChange -- fired when the session changes
	    * auth.statusChange -- fired when the status changes
	    * xfbml.render -- fired when a call to FB.XFBML.parse() completes
	    * edge.create -- fired when the user likes something (fb:like)
	    * edge.remove -- fired when the user unlikes something (fb:like)
	    * comment.create -- fired when the user adds a comment (fb:comments)
	    * comment.remove -- fired when the user removes a comment (fb:comments)
	    * fb.log -- fired on log message
		*/
		eventSubscribe : function(options)
		{ 
			if(!options.event){return;}
			_EnsureInit(function(){
				FB.Event.subscribe(options.event,options.callback);
			});
		} 	
 	};
  
  /* Ensure that FB JS SDK has successfully initialized */
  function _EnsureInit(callback) {
	    if (!window.fbApiInitialized) {
	        setTimeout(function() { _EnsureInit(callback); }, 50);
	    } else {
	        if (callback) { callback(); }
	    }
  	}	

 })(jQuery);