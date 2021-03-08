'use strict';

function galleryView(clicked_id) {
  if (clicked_id.search('folder') < 0) {
    var myModal = new bootstrap.Modal(document.getElementById('galleryModal'), {
      keyboard: true,
    });

    var myModalImage = document.getElementById('galleryModalImage');
    var myModalVideo = document.getElementById('galleryModalVideo');
    // var myModalVideoSrc = document.getElementById('galleryModalVideoSrc');

    var myVideoSrc =
      clicked_id.substr(0, clicked_id.search('_thumb')) + '.h264';

    if (clicked_id.search('video') >= 0) {
      myModalImage.style.display = 'none';
      myModalVideo.style.display = 'block';
      myModalVideo.src = myVideoSrc;
    } else {
      myModalVideo.style.display = 'none';
      myModalImage.style.display = 'block';
      myModalImage.src =
        clicked_id.substr(0, clicked_id.lastIndexOf('_thumb')) + '.jpg';
    }

    myModal.show();
  } else {
    window.location.href =
      window.location.pathname +
      clicked_id.substr(
        clicked_id.lastIndexOf('/'),
        clicked_id.lastIndexOf('_thumb')
      );
  }
}

function deleteImage(clicked_id) {
  var xhr = new XMLHttpRequest();

  xhr.open('delete', clicked_id);

  // xhr.onreadystatechange = function () {
  //   if (this.readyState === 4) {
  //     window.location.reload();
  //   }
  // };

  xhr.send(null);
}

$(document).ready(function () {
  // Gets the video src from the data-src on each button
  $('#galleryModal').on('hidden.bs.modal', function (event) {
    // stop playing the youtube video when I close the modal
    $('#galleryModalVideo').get(0).pause(); // a poor man's stop video
    $('#galleryModalVideo').get(0).currentTime = 0; // a poor man's stop video
  });
});
