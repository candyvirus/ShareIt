function oldBrowser()
{
	$('#Sharedpoints').html('Your browser is not modern enough to serve as a host. :(<br /><br />(Try Chrome or Firefox!)');
}

function ui_onopen()
{
//	$('#Downloading').html('Awaiting file list...');

    console.log("Awaiting peer...");
}

function ui_ready_fileschange(func)
{
	document.getElementById('files').addEventListener('change', function(event)
	{
		func(event.target.files); // FileList object
    }, false);
}

var transfer_begin
function ui_ready_transferbegin(func)
{
	transfer_begin = func
}

function _button(file, hosting)
{
    var div = document.createElement("DIV");
    	div.id = file.name

	div.transfer = function()
	{
	    var transfer = document.createElement("A");
	    	transfer.onclick = function()
	    	{
	    		if(transfer_begin)
			    	transfer_begin(file);
		    	return false;
	    	}
			transfer.appendChild(document.createTextNode("Transfer"));

		while(div.firstChild)
			div.removeChild(div.firstChild);
		div.appendChild(transfer);
	}
	
	div.progressbar = function()
	{
		var progress = document.createTextNode("0%")

		while(div.firstChild)
			div.removeChild(div.firstChild);
		div.appendChild(progress);
	}
	
	div.open = function(blob)
	{
	    var open = document.createElement("A");
	    	open.href = window.URL.createObjectURL(blob)
	    	open.target = "_blank"
			open.appendChild(document.createTextNode("Open"));

		while(div.firstChild)
		{
			window.URL.revokeObjectURL(div.firstChild.href);
			div.removeChild(div.firstChild);
		}
		div.appendChild(open);
	}

    // Show if file have been downloaded previously or if we can transfer it
    if(file.bitmap)
    {
        div.progressbar()

		var chunks = file.size/chunksize;
		if(chunks % 1 != 0)
			chunks = Math.floor(chunks) + 1;

		var value = chunks - Object.keys(file.bitmap).length

		ui_filedownloading(file.name, value, chunks)
    }
    else if(file.blob)
        div.open(file.blob)
    else if(hosting)
        div.open(file)
    else
    	div.transfer()

    return div
}

function _ui_row_downloading(file, hosting)
{
    var tr = document.createElement('TR');

    var td = document.createElement('TD');
    tr.appendChild(td)

    var span = document.createElement('SPAN');
        span.className = "file"
        span.appendChild(document.createTextNode(file.name));
    td.appendChild(span)

    var td = document.createElement('TD');
        td.appendChild(document.createTextNode(file.size));
    tr.appendChild(td)

    var td = document.createElement('TD');
        td.class = "end"
        td.appendChild(_button(file, hosting));
    tr.appendChild(td)

    return tr
}

function _ui_updatefiles(area, files, row_factory, hosting)
{
    // Remove old table and add new empty one
    while(area.firstChild)
        area.removeChild(area.firstChild);

    for(var filename in files)
        if(files.hasOwnProperty(filename))
        {
            var file = files[filename]
            var path = ""
            if(file.path)
                path = file.path + '/';

            var tr = row_factory(file, hosting)
		        tr.id = path + file.name
		        if(path)
		            tr.class = "child-of-" + path

            area.appendChild(tr)
        }
}

function ui_updatefiles_host(files)
{
    var area = document.getElementById('Sharing').getElementsByTagName("tbody")[0]
    _ui_updatefiles(area, files, _ui_row_downloading, true)
}

function ui_updatefiles_peer(files)
{
    var area = document.getElementById('Downloading').getElementsByTagName("tbody")[0]
    _ui_updatefiles(area, files, _ui_row_downloading, false)
}

function ui_update_sharedpoints(sharedpoints)
{
    var area = document.getElementById('Sharedpoints').getElementsByTagName("tbody")[0]
    _ui_updatefiles(area, sharedpoints, _ui_row_downloading, false)
}

function ui_filedownloading(filename, value, total)
{
    var div = $("#" + filename)

    if(total != undefined)
        div.total = total;

	div.html(Math.floor(value/div.total * 100) + '%');
}

function ui_filedownloaded(file)
{
	document.getElementById(file.name).open(file.blob);

	console.log("Transfer of "+file.name+" finished!");
}

function UI_init()
{
    $("#tabs").tabs(
    {
        tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
        add: function(event, ui)
        {
            var tab_content = $tab_content_input.val() || "Tab " + tab_counter + " content.";
            $(ui.panel).append("<p>" + tab_content + "</p>");
        }
    }).find(".ui-tabs-nav").sortable({axis: "x"});

    $("#dialog-config").dialog(
    {
        autoOpen: false,
        resizable: false,
        width: 800,
        height: 600,
        modal: true,
        show: "fold",
        hide: "fold"
    });

    $("#Downloading").treeTable();
    $("#Sharing").treeTable();
    $("#Sharedpoints").treeTable();

    $("#tools-menu").click(function()
    {
        var submenu = $("#tools-menu-submenu")

        if(submenu.is(":hidden"))
        {
            var submenu_active = false;

            function timeout(ms)
            {
                setTimeout(function()
                {
                    if(submenu_active === false)
                        submenu.slideUp();
                }, ms);
            }

            submenu.mouseenter(function()
            {
                submenu_active = true;
            });
            submenu.mouseleave(function()
            {
                submenu_active = false;
                timeout(400)
            });

            submenu.slideDown();
            timeout(1000)
        }
        else
            submenu.slideUp();
    });
}