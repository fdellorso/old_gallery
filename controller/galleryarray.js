var fs = require('fs');
var galleryImages = require('./galleryimage');
var GalleryImage = galleryImages.GalleryImage;

function findIndex(array, stringindex) {
  var __FOUND = -1;
  for (var i = 0; i < array.length; i++) {
    if (array[i][0] == stringindex) {
      __FOUND = i;
      break;
    }
  }
  return __FOUND;
}

class GalleryArray {
  constructor() {
    this.galleryarray = [];
  }
  async createThumbs(galleryfolder, foldername) {
    var foldernameinternal = foldername ? foldername + '/' : '';
    var inputfiles = fs.readdirSync(galleryfolder + foldernameinternal);

    for (var file of inputfiles) {
      if (file != '.DS_Store' && file.search('_thumb') < 0) {
        var indexelem =
          file.lastIndexOf('.') > 0
            ? file.substr(0, file.lastIndexOf('.'))
            : file;
        if (findIndex(this.galleryarray, foldernameinternal + indexelem) < 0) {
          var imageelem = new GalleryImage(
            galleryfolder,
            foldernameinternal.substr(0, foldernameinternal.length - 1),
            file
          );
          await imageelem.createThumb();
          var newelem = [foldernameinternal + indexelem, imageelem];
          this.galleryarray.push(newelem);
        }
      }
    }
  }
  getClientPaths(subfolder) {
    var clientpaths = [];
    for (var arrayelem of this.galleryarray) {
      var imageelem = arrayelem[1];
      var clientpath = imageelem.getClientPath(subfolder);
      if (clientpath) {
        clientpaths.push(clientpath);
      }
    }
    clientpaths.sort(function (a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
    return clientpaths;
  }
  async deleteImage(element) {
    var index = findIndex(this.galleryarray, element);
    await this.galleryarray[index][1].deleteImage();
    this.galleryarray.splice(index, 1);
  }
}

module.exports = {
  GalleryArray: GalleryArray,
};
