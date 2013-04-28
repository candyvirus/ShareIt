var ui = (function(module){
var _priv = module._priv = module._priv || {}

_priv.DialogAbout = function(dialogId, options)
{
  var dialog = $('#' + dialogId);

  if(!$.mobile)
    dialog.dialog(options);

  this.open = function()
  {
    if($.mobile)
      $.mobile.changePage('#' + dialogId);
    else
      dialog.dialog('open');
  };
}

return module
})(ui || {})