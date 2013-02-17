function UI(webp2p)
{
  var isDownloading = false
  var isSharing = false

  var dialog_options =
  {
    autoOpen: false,
    resizable: false,
    width: 800,
    height: 600,
    modal: true,

    /* This effects would fail on Firefox */
    show: 'fold',
    hide: 'fold',

    buttons:
    {
      Accept: function()
      {
        $(this).dialog('close');
      }
    }
  };


  // Config dialog
  var dialogConfig = new DialogConfig("dialog-config", dialog_options, webp2p);

  webp2p.addEventListener('sharedpoints.update', function()
  {
    $(dialogConfig).trigger('sharedpoints.update');
  });


  // About dialog
  var dialogAbout = new DialogAbout('dialog-about', dialog_options);

  $('#About').click(function()
  {
    dialogAbout.open();
  });


  webp2p.addEventListener('error.noPeers', function()
  {
    console.error('Not connected to any peer');

    // Allow backup of cache if there are items
    dialogConfig.preferencesDialogOpen(1);
  });


  // Tabs
  var tabsMain = new TabsMain('tabs', webp2p, dialogConfig.preferencesDialogOpen);

  // Set UID on user interface
  webp2p.addEventListener('uid', function(event)
  {
    var uid = event.data[0];

    $('#UID-home, #UID-about').val(uid);


    /**
     * User initiated process to connect to a remote peer asking for the UID
     */
    function ConnectUser()
    {
//      // Close the menu pop-up on the mobile platform
//      if($.mobile)
//        $('tools-menu-submenu').popup('close');

      // Ask for the peer UID and connect to it
      var uid = prompt('UID to connect');
      if(uid != null && uid != '')
      {
        // Create connection with the other peer
        webp2p.connectTo(uid, function(channel)
        {
          tabsMain.openOrCreatePeer(uid, dialogConfig.preferencesDialogOpen,
                                    webp2p, channel);
        },
        function(uid, peer, channel)
        {
          console.error(uid, peer, channel);
        });
      }
    }

    $('#ConnectUser').unbind('click');
    $('#ConnectUser').click(ConnectUser);

    $('#ConnectUser2').unbind('click');
    $('#ConnectUser2').click(ConnectUser);
  });


  function ConnectUser()
  {
    alert("There's no routing available, wait some more seconds");
  }

  $('#ConnectUser').click(ConnectUser);
  $('#ConnectUser2').click(ConnectUser);


  /**
   * Prevent to close the webapp by accident
   */
  window.onbeforeunload = function()
  {
    // Allow to exit the application normally if we are not connected
    webp2p.numPeers(function(peers)
    {
      if(!peers)
        return;

      // Downloading
      if(isDownloading)
        return 'You are currently downloading files.';

      // Sharing
      if(isSharing)
        return 'You are currently sharing files.';

      // Routing (connected to at least two peers or handshake servers)
      if(peers >= 2)
        return 'You are currently routing between ' + peers + ' peers.';
    })
  };
}