jQuery-FB-JSSDK-Simplified
==========================

JQuery Plugin to simplified FB sdk call

How to Use:
<script>
$(document).ready(function() {	
		//Init Plugin
        $(document).fb({
                        options:{appId: 'YOUR-APP-ID'},
                        perms: 'YOUR-APP-PERMISSION' 
                        });

        //Facebook login with click Event with FB.login call                
        $("#fb_auth").fb('login','REDIRECT-URL-AFTER-LOGIN');

        //App Request or Friends invite with click Event
        $("#fb_invite").fb('appRequests',{message:"My Great Request",suggestions: [uid1, uid2, uid3]});

        //Publish feed after page loaded
        $(document).fb('feed',{name:'',caption:'{*actor*}',description:'',picture:'',link:''});
});
</script>
