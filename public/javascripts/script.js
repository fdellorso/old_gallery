'use strict';

function galleryView(clicked_id) {
  var subfolder = '/';
  var filename = clicked_id.substr(
    clicked_id.search(/\./) + 1,
    clicked_id.lastIndexOf('_') - clicked_id.search(/\./) - 1
  );

  if (window.location.pathname.lastIndexOf('/') > 0) {
    subfolder =
      window.location.pathname.substr(
        window.location.pathname.lastIndexOf('/'),
        window.location.pathname.length -
          window.location.pathname.lastIndexOf('/')
      ) + '/';
  }

  var myModal = new bootstrap.Modal(document.getElementById('galleryModal'), {
    keyboard: true,
  });

  var myModalImage = document.getElementById('img.galleryModal');
  var myModalVideo = document.getElementById('vid.galleryModal');
  var myModalVideoSrc = document.getElementById('vidsrc.galleryModal');

  if (clicked_id.search('photo') >= 0) {
    var myPhotoSrc = subfolder + filename + '.jpg';

    myModalVideo.style.display = 'none';
    myModalImage.style.display = 'block';
    myModalImage.src = myPhotoSrc;

    myModal.show();
  }
  if (clicked_id.search('video') >= 0) {
    var myVideoSrc = subfolder + filename + '.h264';

    myModalImage.style.display = 'none';
    myModalVideo.style.display = 'block';

    // NOTE Safari or Chrome
    if (detectBrowser(0) == 'isChrome') {
      myModalVideo.src = myVideoSrc;
    }
    if (detectBrowser(0) == 'isSafari' || detectBrowser(0) == 'isIos') {
      myModalVideoSrc.src = myVideoSrc;
    }

    myModal.show();
  }
  if (clicked_id.search('folder') >= 0) {
    window.location.href = window.location.pathname + subfolder + filename;
  }
  if (clicked_id.search('360') >= 0) {
    var myPhotoSrc = subfolder + filename + '/' + filename + '.jpg';

    console.log(myPhotoSrc);
    console.log(clicked_id);

    myModalVideo.style.display = 'none';
    myModalImage.style.display = 'block';
    myModalImage.src = myPhotoSrc;

    add360(myModalImage);

    myModal.show();
  }
}

function galleryShare(clicked_id) {
  var filesForDownload = [];
  var subfolder = '/';
  var filename = clicked_id.substr(0, clicked_id.lastIndexOf('_'));
  if (window.location.pathname.lastIndexOf('/') > 0) {
    subfolder =
      window.location.pathname.substr(
        window.location.pathname.lastIndexOf('/'),
        window.location.pathname.length -
          window.location.pathname.lastIndexOf('/')
      ) + '/';
  }
  var srcfile = subfolder + filename;
  var destfile = filename;
  if (subfolder.length > 1) {
    var destfile = subfolder.substr(1, subfolder.length - 2) + '_' + filename;
  }
  if (clicked_id.search('photo') >= 0) {
    srcfile = srcfile + '.jpg';
    destfile = destfile + '.jpg';
    filesForDownload.push({ path: srcfile, name: destfile });
    downloadFile(filesForDownload);
  }
  if (clicked_id.search('video') >= 0) {
    srcfile = srcfile + '.h264';
    destfile = destfile + '.h264';
    alert(srcfile, destfile);
    filesForDownload.push({ path: srcfile, name: destfile });
    downloadFile(filesForDownload);
  }
  if (clicked_id.search('folder') >= 0) {
    var xhr = new XMLHttpRequest();

    xhr.open('post', window.location.pathname + srcfile);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        var array = JSON.parse(xhr.responseText);
        for (var index = 0; index < array.length; index++) {
          var srcfilefolder =
            '/' + srcfile.substr(1, srcfile.length - 1) + '/' + array[index];
          var destfilefolder =
            srcfile.substr(1, srcfile.length - 1) + '_' + array[index];
          filesForDownload.push({ path: srcfilefolder, name: destfilefolder });
          // alert(srcfilefolder + ' - ' + destfilefolder);
        }
        downloadFile(filesForDownload);
      }
    };

    xhr.send(null);
  }
}

async function downloadFile(downloadArray) {
  var temporaryDownloadLink = document.createElement('a');
  temporaryDownloadLink.style.display = 'none';

  document.body.appendChild(temporaryDownloadLink);

  for (var n = 0; n < downloadArray.length; n++) {
    var download = downloadArray[n];
    temporaryDownloadLink.setAttribute('href', download.path);
    temporaryDownloadLink.setAttribute('download', download.name);

    temporaryDownloadLink.click();

    await timeout(100);
  }

  document.body.removeChild(temporaryDownloadLink);
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function galleryDelete(clicked_id) {
  var xhr = new XMLHttpRequest();

  xhr.open(
    'delete',
    window.location.pathname +
      '/' +
      clicked_id.substr(0, clicked_id.lastIndexOf('_'))
  );

  xhr.onreadystatechange = () => {
    if (this.readyState === 4) {
      window.location.reload();
    }
  };

  xhr.send(null);
}

function add360(image360) {
  var imageParent = image360.parentElement;
  var div360 = document.createElement('div');
  var idPrefix = image360.id.substr(image360.id.search(/\./) + 1);
  div360.id = 'div.' + idPrefix;
  console.log(div360.id);
  div360.appendChild(image360);
  imageParent.appendChild(div360);

  var viewer = new JavascriptViewer({
    mainHolderId: div360.id,
    mainImageId: image360.id,
    totalFrames: 72,
    speed: 70,
    zoom: 1,
    defaultProgressBar: true,
  });

  // use events for example
  viewer.events().loadImage.on((progress) => {
    // use this for your own progress bar
    // console.log(`loading ${progress.percentage}%`);
  });
  // }

  viewer.events().started.on((result) => {
    // use a promise or a start event to trigger things
  });

  viewer.start().then(() => {
    // viewer.rotateDegrees(180).then(() => {
    //   // continue with your amazing intro
    // });
  });
}

function remove360(image360, div360) {
  console.log(image360);
  var divParent = div360.parentElement;
  image360.removeAttribute('style');
  divParent.appendChild(image360);
  div360.remove();
}

function gallery360(clicked_id) {
  var div360 = document.getElementById('div.' + clicked_id);
  var image360 = document.getElementById('img.' + clicked_id);
  var anchor360 = document.getElementById('a.' + clicked_id);

  if (!div360) {
    anchor360.removeAttribute('onclick');
    add360(image360);
  } else {
    remove360(image360, div360);
    anchor360.setAttribute('onclick', 'galleryView(this.id)');
  }
}

function detectBrowser(log) {
  // Opera 8.0+
  var isOpera =
    (!!window.opr && !!opr.addons) ||
    !!window.opera ||
    navigator.userAgent.indexOf(' OPR/') >= 0;

  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]"
  var isSafari =
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
      return p.toString() === '[object SafariRemoteNotification]';
    })(
      !window['safari'] ||
        (typeof safari !== 'undefined' && window['safari'].pushNotification)
    );

  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/ false || !!document.documentMode;

  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1 - 79
  var isChrome =
    !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  // Edge (based on chromium) detection
  var isEdgeChromium = isChrome && navigator.userAgent.indexOf('Edg') != -1;

  // Blink engine detection
  var isBlink = (isChrome || isOpera) && !!window.CSS;

  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  var isWPhone = /windows phone/i.test(userAgent);

  var isAndroid = /android/i.test(userAgent);

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  var isIos = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;

  if (log) {
    var output = 'Detecting browsers by ducktyping:\n';
    output += 'isFirefox: ' + isFirefox + '\n';
    output += 'isChrome: ' + isChrome + '\n';
    output += 'isSafari: ' + isSafari + '\n';
    output += 'isOpera: ' + isOpera + '\n';
    output += 'isIE: ' + isIE + '\n';
    output += 'isEdge: ' + isEdge + '\n';
    output += 'isEdgeChromium: ' + isEdgeChromium + '\n';
    output += 'isBlink: ' + isBlink;
    output += 'isWPhone: ' + isWPhone + '\n';
    output += 'isAndroid: ' + isAndroid + '\n';
    output += 'isIos: ' + isIos;
    console.log(output);
  } else {
    if (isOpera) {
      return 'idOpera';
    }
    if (isFirefox) {
      return 'isFirefox';
    }
    if (isSafari) {
      return 'isSafari';
    }
    if (isIE) {
      return 'isIE';
    }
    if (isEdge) {
      return 'isEdge';
    }
    if (isChrome) {
      return 'isChrome';
    }
    if (isEdgeChromium) {
      return 'isEdgeChromium';
    }
    if (isBlink) {
      return 'isBlink';
    }
    if (isWPhone) {
      return 'isWPhone';
    }
    if (isAndroid) {
      return 'isAndroid';
    }
    if (isIos) {
      return 'isIos';
    }
  }
}

$(function () {
  detectBrowser(1);

  // Gets the video src from the data-src on each button
  $('#galleryModal').on('hidden.bs.modal', function (event) {
    // stop playing the youtube video when I close the modal
    $('#vid\\.galleryModal').get(0).pause(); // a poor man's stop video
    $('#vid\\.galleryModal').get(0).currentTime = 0; // a poor man's stop video
    // var div360 = $('#div\\.galleryModal');
    var div360 = document.getElementById('div.galleryModal');
    if (div360) {
      // var image360 = $('#img\\.galleryModal');
      var image360 = document.getElementById('img.galleryModal');
      remove360(image360, div360);
    }
  });
});
