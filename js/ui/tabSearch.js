var ui = (function(module, shareit){
var _priv = module._priv = module._priv || {}


_priv.TabSearch = function(query, tabsId, onclickFactory)
{
  // Tabs
  var div = document.createElement('DIV');
      div.id = tabsId + '-' + query;
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
        h1.appendChild(document.createTextNode('Search: ' + query));

    $(h1).appendTo(header);

    $(header).appendTo(div);
  }
  else
  {
    $('#'+tabsId).tabs('refresh');
    $('#'+tabsId).tabs('option', 'active', -1);
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
    th.abbr = 'Score';
    th.appendChild(document.createTextNode('Score'));
  tr.appendChild(th);

  var th = document.createElement('TH');
    th.scope = 'col';
    th.abbr = 'Copies';
    th.appendChild(document.createTextNode('Copies'));
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
      td.colSpan = 6;
      td.align = 'center';
      td.appendChild(document.createTextNode('Searching...'));
  tr.appendChild(td);


  var self = this;

  function noFilesCaption()
  {
    // Compose no files shared content (fail-back)
    var captionCell = _priv.spanedCell(table);
        captionCell.appendChild(document.createTextNode('No files found.'));

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

    // Score
    var td = document.createElement('TD');
        td.appendChild(document.createTextNode(fileentry.score.toFixed(2)));
    tr.appendChild(td);

    // Copies
    var duplicates = 1
    if(fileentry.duplicates)
      duplicates += fileentry.duplicates.length

    var td = document.createElement('TD');
        td.appendChild(document.createTextNode(duplicates));
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
    for(var i = 0; i<fileslist.length; i++)
    {
      var fileentry = fileslist[i]

      // Fileentry
      var tr_file = rowFileentry(fileentry);
      this.tbody.appendChild(tr_file);

      // Duplicates
      var duplicates = fileentry.duplicates
      if(duplicates)
      {
        tr_file.setAttribute('data-tt-id', fileentry.name);

        tr_file.setAttribute('data-tt-initialState', "collapsed");

        for(var j = 0; j<duplicates.length; j++)
        {
          var duplicate = duplicates[j]

          var tr = document.createElement('TR');
              tr.setAttribute('data-tt-id', "");
              tr.setAttribute('data-tt-parent-id', fileentry.name);

          var td = document.createElement('TD');
              td.colSpan = 6

          // Name & icon
          var a = document.createElement('A');
              a.onclick = function()
              {
                // Swap names
                var aux = fileentry.name
                fileentry.name = duplicate.name
                duplicate.name = aux

                // Update fileentry row
                var span = tr_file.cells[0].childNodes[1]
                span.childNodes[0].nodeValue = fileentry.name

                // Update duplicate row
                this.childNodes[0].nodeValue = duplicate.name
              }

          a.appendChild(document.createTextNode(duplicate.name));
          td.appendChild(a);
          tr.appendChild(td);
          this.tbody.appendChild(tr);
        }
      }
    }
  };
}
_priv.TabSearch.prototype = _priv.FilesTable;

return module
})(ui || {}, shareit)