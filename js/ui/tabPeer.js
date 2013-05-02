var ui = (function(module, shareit){
var _priv = module._priv = module._priv || {}


_priv.TabPeer = function(uid, tabsId, preferencesDialogOpen, onclickFactory)
{
  // Tabs
  var div = document.createElement('DIV');
      div.id = tabsId + '-' + uid;
      div.dataset.role = 'page'
      div.setAttribute('data-add-back-btn', true);

  $(div).appendTo('#' + tabsId);

  // Tab
  if($.mobile)
  {
    var header = document.createElement('DIV');
        header.dataset.role = 'header'
        header.dataset.position = 'fixed'
        header.setAttribute('class', 'only-mobile');

    var h1 = document.createElement('H1');
        h1.appendChild(document.createTextNode('UID: ' + uid));

    $(h1).appendTo(header);

    $(header).appendTo(div);
  }
  else
  {
    $('#tabs').tabs('refresh');
    $('#tabs').tabs('option', 'active', -1);
  }

  // Table
  var table = document.createElement('TABLE');
  div.appendChild(table);

  // Tab panel
  var thead = document.createElement('THEAD');
  table.appendChild(thead);

  var tr = document.createElement('TR');
  thead.appendChild(tr);

  var th = document.createElement('TH');
      th.scope = 'col';
      th.abbr = 'Filename';
      th.width = '100%';
      th.appendChild(document.createTextNode('Filename'));
  tr.appendChild(th);

  var th = document.createElement('TH');
      th.scope = 'col';
      th.abbr = 'Type';
      th.appendChild(document.createTextNode('Type'));
  tr.appendChild(th);

  var th = document.createElement('TH');
      th.scope = 'col';
      th.abbr = 'Size';
      th.appendChild(document.createTextNode('Size'));
  tr.appendChild(th);

  var th = document.createElement('TH');
      th.scope = 'col';
      th.abbr = 'Action';
      th.appendChild(document.createTextNode('Action'));
  tr.appendChild(th);

  this.tbody = document.createElement('TBODY');
  table.appendChild(this.tbody);

  var tr = document.createElement('TR');
  this.tbody.appendChild(tr);

  var td = document.createElement('TD');
      td.colSpan = 4;
      td.align = 'center';
      td.appendChild(document.createTextNode('Waiting for the peer data'));
  tr.appendChild(td);


  var self = this;

  function noFilesCaption()
  {
    // Compose no files shared content (fail-back)
    var captionCell = _priv.spanedCell(table);
    captionCell.appendChild(document.createTextNode('Remote peer is not sharing files.'));

//    var anchor = document.createElement('A')
//        anchor.id = 'ConnectUser'
//        anchor.style.cursor = 'pointer'
//    captionCell.appendChild(anchor)
//
//    $(anchor).click(preferencesDialogOpen)
//
//    var span = document.createElement('SPAN')
//        span.setAttribute("class", "user")
//        span.appendChild(document.createTextNode("Connect to a user"))
//    anchor.appendChild(span)
    captionCell.appendChild(document.createTextNode(" Why don't ask him about doing it?"));

    return captionCell;
  }
  this.noFilesCaption = noFilesCaption();


  function rowFileentry(fileentry)
  {
    var tr = document.createElement('TR');
    tr.setAttribute('data-tt-id', "");  // Hack for TreeTable

    var td = document.createElement('TD');
    tr.appendChild(td);

    var blob = fileentry.file || fileentry.blob || fileentry;

    var type = blob.type;

    // Name & icon
    var span = document.createElement('SPAN');
        span.className = _priv.filetype2className(type);
        span.appendChild(document.createTextNode(fileentry.name));
    td.appendChild(span);

    // Type
    var td = document.createElement('TD');
        td.appendChild(document.createTextNode(type || '(unknown)'));
    tr.appendChild(td);

    // Size
    var size = blob.size;

    var td = document.createElement('TD');
        td.className = 'filesize';
        td.appendChild(document.createTextNode(humanize.filesize(size)));
    tr.appendChild(td);

    // Action
    var td = document.createElement('TD');
        td.class = 'end';
        td.appendChild(_priv.buttonFactory(self, fileentry, onclickFactory));
    tr.appendChild(td);

    return tr;
  }

  this.updateFiles = function(fileslist)
  {
    var prevPath = '';

    for(var i=0, fileentry; fileentry=fileslist[i]; i++)
    {
      // Folder
      var path = fileentry.path;

      if(path && prevPath != path)
      {
        prevPath = path;

        this.tbody.appendChild(_priv.rowFolder(path, 4));
      }

      // Fileentry
      var tr_file = rowFileentry(fileentry);
      this.tbody.appendChild(tr_file);

      if(prevPath)
        tr_file.setAttribute('data-tt-parent-id', prevPath);

      // Duplicates
      if(fileentry.duplicates)
      {
        tr_file.setAttribute('data-tt-id', prevPath
                                         ? prevPath+"/"+fileentry.name
                                         : fileentry.name);

        tr_file.setAttribute('data-tt-initialState', "collapsed");

        for(var j = 0, duplicate; duplicate = fileentry.duplicates[j]; j++)
        {
          var tr = document.createElement('TR');
              tr.setAttribute('data-tt-id', "");
              tr.setAttribute('data-tt-parent-id', prevPath+"/"+fileentry.name);

          var td = document.createElement('TD');
              td.colSpan = 4

          var fullpath = ""

          // Peer
          if(duplicate.peer)
            fullpath += '['+duplicate.peer+']'

          // Sharedpoint
          if(duplicate.sharedpoint)
            fullpath += '/'+duplicate.sharedpoint

          // Path
          if(duplicate.path)
          {
            if(fullpath)
               fullpath += '/'
            fullpath += duplicate.path
          }

          // Name
          if(fullpath)
             fullpath += '/'
          fullpath += duplicate.name

          td.appendChild(document.createTextNode(fullpath));

          tr.appendChild(td);
        }

        this.tbody.appendChild(tr);
      }
    }
  };
}
_priv.TabPeer.prototype = _priv.FilesTable;

return module
})(ui || {}, shareit)