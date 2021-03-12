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
  var xhr = new XMLHttpRequest();

  xhr.open('delete', clicked_id);

  // xhr.onreadystatechange = function () {
  //   if (this.readyState === 4) {
  //     window.location.reload();
  //   }
  // };

  xhr.send(null);
}

function galleryDelete(clicked_id) {
  var xhr = new XMLHttpRequest();

  xhr.open(
    'delete',
    window.location.pathname +
      '/' +
      clicked_id.substr(0, clicked_id.lastIndexOf('_'))
  );

  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      window.location.reload();
    }
  };

  xhr.send(null);
}

$(function () {
  // Gets the video src from the data-src on each button
  $('#galleryModal').on('hidden.bs.modal', function (event) {
    // stop playing the youtube video when I close the modal
    $('#galleryModalVideo').get(0).pause(); // a poor man's stop video
    $('#galleryModalVideo').get(0).currentTime = 0; // a poor man's stop video
  });
});
