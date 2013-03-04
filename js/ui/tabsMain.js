var ui = (function(module){
var _priv = module._priv = module._priv || {}

_priv.TabsMain = function(tabsId, shareit, preferencesDialogOpen)
{
  var self = this;

  var tabs = $('#' + tabsId);

  tabs.tabs({
    activate: function(event, ui) {
      $('#Home-tab').detach();
    },

    active: false,
    collapsible: true,
    disabled: true
  });


  // Downloading tab
  var tabDownloading = new _priv.TabDownloading('Downloading',
                                                preferencesDialogOpen);

  function tabDownloading_update()
  {
    tabDownloading.dirty = requestAnimationFrame(function()
    {
      shareit.files_downloading(function(error, filelist)
      {
        if(error)
          console.error(error)
        else
        {
          self.isDownloading = filelist.length;
          tabDownloading.update(filelist);

          tabDownloading.dirty = false;
        }
      });
    }, tabDownloading.tbody);
  }

  function tabDownloading_checkAndUpdate()
  {
    // Only update the sharing tab if it's active
    if(tabs.tabs('option', 'active') != 0)
    {
      tabs.tabs('enable', 0);
      tabs.tabs('option', 'collapsible', false);

      tabDownloading.dirty = true
      return;
    }

    tabDownloading_update();
  }

  shareit.addEventListener('transfer.begin', tabDownloading_checkAndUpdate);
  shareit.addEventListener('transfer.update', function(event)
  {
    var fileentry = event.fileentry;
    var value = event.value;

    $(tabDownloading).trigger(fileentry, [value]);
  });
  shareit.addEventListener('transfer.end', tabDownloading_checkAndUpdate);


  // Sharing tab
  var tabSharing = new _priv.TabSharing('Sharing', preferencesDialogOpen);

  function tabSharing_update()
  {
    tabSharing.dirty = requestAnimationFrame(function()
    {
      shareit.files_sharing(function(error, filelist)
      {
        if(error)
          console.error(error)
        else
        {
          self.isSharing = filelist.length;
          tabSharing.update(filelist);

          tabSharing.dirty = false;
        }
      });
    }, tabSharing.tbody);
  }

  function tabSharing_checkAndUpdate()
  {
    // Only update the sharing tab if it's active
    if(tabs.tabs('option', 'active') != 1)
    {
      tabs.tabs('enable', 1);
      tabs.tabs('option', 'collapsible', false);

      tabSharing.dirty = true
      return;
    }

    tabSharing_update();
  }

  shareit.addEventListener('transfer.end', tabSharing_checkAndUpdate);

  shareit.addEventListener('file.added',   tabSharing_checkAndUpdate);
  shareit.addEventListener('file.deleted', tabSharing_checkAndUpdate);


  function tabsbeforeactivate(event, ui)
  {
    var newPanel = ui.newPanel || ui.nextPage
        newPanel = newPanel['0']

    if(newPanel)
      switch(newPanel.id)
      {
        case 'Downloading':
          if(tabDownloading.dirty)
             tabDownloading_update();
          break;

        case 'Sharing':
          if(tabSharing.dirty)
             tabSharing_update();
          break;
      }
  };
  tabs.on('tabsbeforeactivate', tabsbeforeactivate)
  $(document).live('pagebeforehide', tabsbeforeactivate)

  // Peers tabs
  this.openOrCreatePeer = function(uid, preferencesDialogOpen, shareit, channel)
  {
    var tabPanelId = '#' + tabsId + '-' + uid;

    // Get index of the peer tab
    var index = tabs.find('table').index($(tabPanelId));

    // Peer tab exists, open it
    if(index != -1)
      tabs.tabs('option', 'active', index);

    // Peer tab don't exists, create it
    else
    {
      // Tab
      var li = document.createElement('LI');

      var a = document.createElement('A');
          a.href = tabPanelId;
          a.appendChild(document.createTextNode('UID: ' + uid));
      li.appendChild(a);

      var span = document.createElement('SPAN');
          span.setAttribute('class', 'ui-icon ui-icon-closethick');
          span.appendChild(document.createTextNode('Remove Tab'));
          span.onclick = function()
          {
            channel.fileslist_disableUpdates();

            // Remove the tab
            var index = $('#ui-corner-top', tabs).index($(this).parent());
            tabs.find('.ui-tabs-nav li:eq(' + index + ')').remove();

            // Remove the panel
            $(tabPanelId).remove();

            // If there are no more peer/search tabs, check if we are sharing or
            // downloading a file and if not, show again the Home screen
            var disabled = $('#' + tabsId).tabs('option', 'disabled');
//            if(!index && disabled.length == 2)
            if(disabled.length == 2)
            {
              $('#' + tabsId).tabs('option', 'collapsible', true);
              $('#Home-tab').appendTo('#' + tabsId);
            }

            // Refresh the tabs widget
            if(!$.mobile)
              tabs.tabs('refresh');
          };
      li.appendChild(span);

      $(li).appendTo('#' + tabsId + ' .ui-tabs-nav');

      // Tab panel
      if($.mobile)
        $('#Home ul').listview('refresh');

      var tabPeer = new _priv.TabPeer(uid, tabsId, preferencesDialogOpen,
      function(fileentry)
      {
        return function()
        {
          policy(function()
          {
            // Begin transfer of file
            shareit.transfer_begin(fileentry);

            // Don't buble click event
            return false;
          });
        }
      });

      shareit.addEventListener('transfer.begin', function(event)
      {
        var fileentry = event.fileentry;

        $(tabPeer).trigger(fileentry.hash + '.begin');
      });
      shareit.addEventListener('transfer.update', function(event)
      {
        var fileentry = event.fileentry;
        var value = event.value;

        $(tabPeer).trigger(fileentry.hash + '.update', [value]);
      });
      shareit.addEventListener('transfer.end', function(event)
      {
        var fileentry = event.fileentry;

        $(tabPeer).trigger(fileentry.hash + '.end');
      });

      // Get notified when this channel files list is updated
      // and update the UI peer files table
      channel.addEventListener('fileslist._updated', function(event)
      {
        var fileslist = event.fileentry;

        tabPeer.update(fileslist);
      });

      // Request the peer's files list
      var SEND_UPDATES = 1;
//      var SMALL_FILES_ACCELERATOR = 2
      var flags = SEND_UPDATES;
//      if()
//        flags |= SMALL_FILES_ACCELERATOR
      channel.fileslist_query(flags);
    }
  };


  // Tools menu
  _priv.MenuTools('tools-menu');
}

return module
})(ui || {})