$(document).ready(function(){

  $('#postbutton').click(function(){
    $.post("/" + window.threadId + "/post",$('#addpost').serialize());
    $('.bodyin').val('');
    location.reload(true);
  });
});
