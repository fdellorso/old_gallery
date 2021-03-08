var express = require('express');
var router = express.Router();

var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var createCollage = require('@settlin/collage');

var dirgallery = './gallery/';

function videoThumbnail(filename, dirname) {
  var newfile = filename.substr(0, filename.length - 5) + '.jpg';

  return new Promise((resolve) => {
    ffmpeg(dirname + filename)
      .screenshots({
        timestamps: [5.0],
        filename: newfile,
        folder: dirname,
      })
      .on('end', () => {
        resolve();
      });
  });
}

function photosCollage(photosArray, dirname, filename, rows, cols) {
  var options = {
    sources: photosArray,
    width: rows,
    height: cols,
    imageWidth: 300 / rows,
    imageHeight: 225 / cols,
    spacing: 0,
  };

  return new Promise((resolve) => {
    createCollage(options).then((canvas) => {
      const src = canvas.jpegStream();
      const dest = fs.createWriteStream(dirname + filename);
      src.pipe(dest);
      dest.on('finish', () => {
        resolve();
      });
    });
  });
}

function createThumb(dirname) {
  var files = [];

  fs.readdirSync(dirname).forEach(async (file) => {
    if (file != '.DS_Store' && file.search('_thumb') < 0) {
      if (file.search('.h264') > 0) {
        var videofile = file.substr(0, file.length - 5) + '_thumb_video.jpg';
        if (!fs.existsSync(dirname + videofile)) {
          await videoThumbnail(file, dirname);
          var collage = [];
          collage.push(file.substr(0, file.length - 5) + '.jpg');
          collage = collage.map((i) => dirname + i);
          await photosCollage(collage, dirname, videofile, 1, 1);
          try {
            fs.unlinkSync(dirname + file.substr(0, file.length - 5) + '.jpg');
          } catch (err) {
            console.error(err);
          }
          videofile = file.substr(0, file.length - 5) + '_thumb_video_new.jpg';
        }
        files.push(videofile);
      }
      if (file.search('.jpg') > 0) {
        var imagefile = file.substr(0, file.length - 4) + '_thumb.jpg';
        if (!fs.existsSync(dirname + imagefile)) {
          var collage = [];
          collage.push(file);
          collage = collage.map((i) => dirname + i);
          photosCollage(collage, dirname, imagefile, 1, 1);
          imagefile = file.substr(0, file.length - 4) + '_thumb_new.jpg';
        }
        files.push(imagefile);
      }
      if (file.lastIndexOf('.') < 0) {
        var folderfile = file + '_thumb_folder.jpg';
        if (!fs.existsSync(dirname + folderfile)) {
          var collage = [];
          fs.readdirSync(dirname + file).forEach((subfile) => {
            if (subfile != '.DS_Store' && subfile.search('_thumb') < 0) {
              collage.push(subfile);
            }
          });
          collage = collage.map((i) => dirname + file + '/' + i);
          photosCollage(collage, dirname, folderfile, 2, 2);
          folderfile = file + '_thumb_folder_new.jpg';
        }
        files.push(folderfile);
      }
    }
  });

  files.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  files = files.map(
    (i) => dirname.substr(dirgallery.length - 1, dirname.length) + i
  );

  return files;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* GET home page. */
router.get('/', async (req, res, next) => {
  var files = createThumb(dirgallery);
  await sleep(1000);
  console.log(files);
  res.render('index', {
    title: 'Express',
    images: files,
    url: req.originalUrl,
  });
});

router.get('/:id', async (req, res, next) => {
  var files = createThumb(dirgallery + req.params.id + '/');
  await sleep(1000);
  console.log(files);
  res.render('index', {
    title: 'Express',
    images: files,
    url: req.originalUrl,
  });
});

router.delete('/:id', function (req, res, next) {
  console.log(req.params.id);
  // try {
  //   fs.unlinkSync(dirname + file.substr(0, file.length - 5) + '.jpg');
  // } catch (err) {
  //   console.error(err);
  // }
  res.send('ok');
});

module.exports = router;
