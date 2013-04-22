var ui = (function(module){
var _priv = module._priv = module._priv || {}

_priv.filetype2className = function(filetype)
{
  filetype = filetype.split('/');

  switch(filetype[0])
  {
    case 'image':
      return 'image';
    case 'video':
      return 'video';
  }

  // Unknown file type, return generic file
  return 'file';
}

_priv.spanedCell = function(table)
//Creates a cell that span over all the columns of a table
{
  var td = document.createElement('TD');
  td.colSpan = table.getElementsByTagName('thead')[0].rows[0].cells.length;
  td.align = 'center';

  return td;
}

_priv.rowFolder = function(path)
{
  // Folder row
  var tr = document.createElement('TR');
      tr.setAttribute('data-tt-id',path);

  // Split full path in path and name
  var path = path.split('/');
  var name = path.slice(-1)
  path = path.slice(0, -1).join('/');

  // Set the parent of the folder
  if(path)
    tr.setAttribute('data-tt-parent-id',path);

  var td = document.createElement('TD');
      td.colSpan = 2;
  tr.appendChild(td);

  // Name & icon
  var span = document.createElement('SPAN');
      span.className = 'folder';
      span.appendChild(document.createTextNode(name));
  td.appendChild(span);

  return tr;
}


_priv.FilesTable =
{
  dirty: true,

  update: function(fileslist)
  {
    // Remove old table and add new empty one
    while(this.tbody.firstChild)
      this.tbody.removeChild(this.tbody.firstChild);

    if(fileslist.length)
    {
      fileslist.sort(function(a, b)
      {
        function strcmp(str1, str2)
        {
          return ((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1));
        }

        var result = strcmp(a.sharedpoint, b.sharedpoint);
        if(result)
          return result;

        var result = strcmp(a.path, b.path);
        if(result)
          return result;

        var result = strcmp(a.file ? a.file.name : a.name, b.file ? b.file.name : b.name);
        if(result)
          return result;
      });

      this.updateFiles(fileslist);

      $(this.tbody.parentNode).treetable("destroy")
      $(this.tbody.parentNode).treetable(
      {
        expandable: true,
        initialState: 'expanded'
      });
      $(this.tbody).find("tr").mouseover(function()
      {
        $("tr.mouseover").removeClass("mouseover");
        $(this).addClass("mouseover");
      })
      $(this.tbody).find("tr").mousedown(function()
      {
        $("tr.selected").removeClass("selected");
        $(this).addClass("selected");
      })
    }
    else
    {
      var tr = document.createElement('TR');
      tr.appendChild(this.noFilesCaption);

      this.tbody.appendChild(tr);
    }
  }
}

return module
})(ui || {})