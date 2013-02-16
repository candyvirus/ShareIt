function loadfile(filename)
{
  var fileref

  switch(filename.split('.').pop())
  {
    case 'js':  // filename is a external JavaScript file
      fileref=document.createElement('script')
      fileref.setAttribute("type","text/javascript")
      fileref.setAttribute("src", filename)
      break

    case 'css': // filename is an external CSS file
      fileref=document.createElement("link")
      fileref.setAttribute("rel", "stylesheet")
      fileref.setAttribute("type", "text/css")
      fileref.setAttribute("href", filename)
      break

    default:
      console.error('File '+filename+' is not from a known type')
      return
  }

  document.getElementsByTagName("head")[0].appendChild(fileref)
}

// Mobile
if(window.screen.width < 960)
{
  loadfile("lib/jquery.mobile/jquery.mobile.min.css")
  loadfile("lib/jquery.mobile-tabs/jquery.mobile.tabs.css")

  loadfile("css/mobile.css")

  loadfile("lib/jquery.mobile/jquery.mobile.min.js")
  loadfile("lib/jquery.mobile-tabs/jquery.mobile.tabs.js")
}

// Desktop
else
{
  loadfile("lib/jquery-ui/jquery-ui.css")

  loadfile("css/desktop.css")

  loadfile("lib/jquery-ui/jquery-ui.min.js")
}