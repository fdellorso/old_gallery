'use strict';

function galleryView(clicked_id) {
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
  if (clicked_id.search('photo') >= 0) {
    var myModal = new bootstrap.Modal(document.getElementById('galleryModal'), {
      keyboard: true,
    });

    var myModalImage = document.getElementById('galleryModalImage');
    var myModalVideo = document.getElementById('galleryModalVideo');
    var myModalVideoSrc = document.getElementById('galleryModalVideoSrc');

    var myPhotoSrc = subfolder + filename + '.jpg';

    myModalVideo.style.display = 'none';
    myModalImage.style.display = 'block';
    myModalImage.src = myPhotoSrc;

    myModal.show();
  }
  if (clicked_id.search('video') >= 0) {
    var myModal = new bootstrap.Modal(document.getElementById('galleryModal'), {
      keyboard: true,
    });

    var myModalImage = document.getElementById('galleryModalImage');
    var myModalVideo = document.getElementById('galleryModalVideo');
    var myModalVideoSrc = document.getElementById('galleryModalVideoSrc');

    var myVideoSrc = subfolder + filename + '.h264';

    myModalImage.style.display = 'none';
    myModalVideo.style.display = 'block';
    // myModalVideo.src = myVideoSrc;
    myModalVideoSrc.src = myVideoSrc;

    myModal.show();
  }
  if (clicked_id.search('folder') >= 0) {
    window.location.href = window.location.pathname + subfolder + filename;
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

function gallery360(clicked_id) {
  // var anchor = document.getElementById('a.' + clicked_id);

  // var image = document.getElementById('img.' + clicked_id);
  var div360 = document.getElementById('jsv.holder.' + clicked_id);
  // var img360 = document.getElementById('jsv.image.' + clicked_id);

  // if (image.style.display != 'none') {
  // image.style.display = 'none';
  // div360.style.display = 'inline';
  // img360.style.display = 'inline';

  if (div360.childElementCount == 1) {
    var viewer = new JavascriptViewer({
      mainHolderId: 'jsv.holder.' + clicked_id,
      mainImageId: 'jsv.image.' + clicked_id,
      totalFrames: 72,
      speed: 70,
      defaultProgressBar: true,
    });

    // use events for example
    viewer.events().loadImage.on((progress) => {
      // use this for your own progress bar
      console.log(`loading ${progress.percentage}%`);
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
  } else {
    // div360.style.display = 'none';
    // img360.style.display = 'none';
    // image.style.display = 'inline';
  }

  // var divisor = document.createElement('div');
  // divisor.id = 'jsv.holder.' + clicked_id;

  // var img360 = document.createElement('img');
  // img360.id = 'jsv.image.' + clicked_id;
  // img360.className = 'centered-and-cropped';
  // img360.width = '100%';
  // img360.height = '225';
  // img360.src = 'https://360-javascriptviewer.com/images/ipod/ipod.jpg';

  // divisor.appendChild(img360);
  // anchor.appendChild(divisor);
}

$(function () {
  // Gets the video src from the data-src on each button
  $('#galleryModal').on('hidden.bs.modal', function (event) {
    // stop playing the youtube video when I close the modal
    $('#galleryModalVideo').get(0).pause(); // a poor man's stop video
    $('#galleryModalVideo').get(0).currentTime = 0; // a poor man's stop video
  });
});
