var express = require('express');
var router = express.Router();

var galleryArrays = require('../controller/galleryarray');
var GalleryArray = galleryArrays.GalleryArray;

var dirgallery = './gallery/';
var galleryarray = new GalleryArray();

/* GET home page. */
router.get('/', async (req, res, next) => {
  await galleryarray.createThumbs(dirgallery, '');
  var files = galleryarray.getClientPaths('');
  console.log(files);
  res.render('index', {
    title: 'Express',
    images: files,
    url: req.originalUrl,
  });
});

router.get('/:id', async (req, res, next) => {
  await galleryarray.createThumbs(dirgallery, req.params.id);
  var files = galleryarray.getClientPaths(req.params.id);
  console.log(files);
  res.render('index', {
    title: 'Express',
    images: files,
    url: req.originalUrl,
  });
});

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

router.delete('/:id', async (req, res, next) => {
  console.log(req.params.id);
  indexelem = req.params.id;
  await galleryarray.deleteImage(indexelem);
  res.send('ok');
});

router.delete('/:id1/:id2', async (req, res, next) => {
  console.log(req.params.id1);
  console.log(req.params.id2);
  indexelem = req.params.id1 + '/' + req.params.id2;
  await galleryarray.deleteImage(indexelem);
  res.send('ok');
});

module.exports = router;
