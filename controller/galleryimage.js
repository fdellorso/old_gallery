var fs = require('fs');
var del = require('del');
var ffmpeg = require('fluent-ffmpeg');
// var createCollage = require('@settlin/collage');
var sharp = require('sharp');

async function videoThumbnail(videofile, thumbfile) {
  var thumbfolder = videofile.substr(0, videofile.lastIndexOf('/') + 1);
  await new Promise((resolve) => {
    ffmpeg(videofile)
      .screenshots({
        timestamps: [5.0],
        filename: thumbfile,
        folder: thumbfolder,
        size: '280x210',
      })
      .on('end', () => {
        resolve();
      });
  });
}

// async function photosCollage(photosArray, thumbfile, rows, cols) {
//   var options = {
//     sources: photosArray,
//     width: rows,
//     height: cols,
//     imageWidth: 280 / rows,
//     imageHeight: 210 / cols,
//     spacing: 0,
//   };

//   await new Promise((resolve) => {
//     createCollage(options).then((canvas) => {
//       const src = canvas.jpegStream();
//       const dest = fs.createWriteStream(thumbfile);
//       src.pipe(dest);
//       dest.on('finish', () => {
//         resolve();
//       });
//     });
//   });
// }

async function photoThumbnail(photo, thumbfile) {
  await new Promise((resolve) => {
    sharp(photo)
      .resize({ width: 280, height: 210 })
      .jpeg({ quality: 100 })
      .toFile(thumbfile)
      .then((data) => {
        console.log(data);
        resolve();
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

class GalleryImage {
  constructor(galleryfolder, foldername, filename) {
    this.galleryfolder = galleryfolder;
    this.foldername = foldername ? foldername + '/' : '';
    this.filename =
      filename.lastIndexOf('.') > 0
        ? filename.substr(0, filename.lastIndexOf('.'))
        : filename;
    this.extension = '';
    this.thumbflag = false;
    this.newflag = false;
    this.setExtension(filename);
  }
  getClientPath(subfolder) {
    var clientpath = '';
    if (subfolder == this.foldername.substr(0, this.foldername.length - 1)) {
      clientpath =
        '/' +
        this.foldername +
        this.filename +
        (this.thumbflag ? '_thumb' : '') +
        '_' +
        this.getType() +
        (this.newflag ? '_new' : '') +
        '.jpg';
      this.newflag = false;
    }
    return clientpath;
  }
  getServerPath() {
    var serverpath = [];
    serverpath.push(
      this.galleryfolder + this.foldername + this.filename + this.extension
    );
    if (this.thumbflag) {
      serverpath.push(
        this.galleryfolder + this.foldername + this.filename + '_thumb' + '.jpg'
      );
    }
    return serverpath;
  }
  setExtension(filename) {
    if (filename.search('.h264') > 0) {
      this.extension = '.h264';
    }
    if (filename.search('.jpg') > 0) {
      this.extension = '.jpg';
    }
    if (filename.lastIndexOf('.') < 0) {
      this.extension = '';
    }
  }
  getType() {
    if (this.extension == '.h264') {
      return 'video';
    }
    if (this.extension == '.jpg') {
      return 'photo';
    }
    if (this.extension == '') {
      var folderfile = fs.readdirSync(
        this.galleryfolder + this.foldername + this.filename + '/'
      );
      if (folderfile.length >= 60) {
        return '360';
      } else {
        return 'folder';
      }
    }
  }
  async createThumb() {
    if (
      fs.existsSync(
        this.galleryfolder + this.foldername + this.filename + '_thumb.jpg'
      )
    ) {
      this.newflag = false;
      this.thumbflag = true;
    }
    if (!this.thumbflag) {
      if (this.getType() == 'video') {
        await videoThumbnail(
          this.galleryfolder + this.foldername + this.filename + this.extension,
          this.filename + '_thumb.jpg'
        );
      }
      if (this.getType() == 'photo') {
        // var collage = this.getServerPath();
        // await photosCollage(
        //   collage,
        //   this.galleryfolder + this.foldername + this.filename + '_thumb.jpg',
        //   1,
        //   1
        // );
        var inputfile = this.getServerPath()[0];
        var thumbfile =
          this.galleryfolder + this.foldername + this.filename + '_thumb.jpg';
        console.log(inputfile);
        console.log(thumbfile);
        await photoThumbnail(inputfile, thumbfile);
      }
      if (this.getType() == 'folder') {
        var collage = [];
        var folderfile = fs.readdirSync(
          this.galleryfolder + this.foldername + this.filename + '/'
        );
        for (var subfile of folderfile) {
          if (subfile != '.DS_Store' && subfile.search('_thumb') < 0) {
            collage.push(subfile);
          }
        }
        collage = collage.map(
          (i) => this.galleryfolder + this.foldername + this.filename + '/' + i
        );
        // await photosCollage(
        //   collage,
        //   this.galleryfolder + this.foldername + this.filename + '_thumb.jpg',
        //   2,
        //   2
        // );
        var inputfile = collage[0];
        var thumbfile =
          this.galleryfolder + this.foldername + this.filename + '_thumb.jpg';
        await photoThumbnail(inputfile, thumbfile);
      }
      if (this.getType() == '360') {
        var folderfile = fs.readdirSync(
          this.galleryfolder + this.foldername + this.filename + '/'
        );
        for (var subfile of folderfile) {
          if (subfile != '.DS_Store' && subfile.search('_thumb') < 0) {
            if (subfile.search('_') >= 0) {
              var filename = subfile.substr(0, subfile.search('_'));
              var extension = subfile.substr(subfile.search('_'));
            } else {
              var filename = subfile.substr(0, subfile.lastIndexOf('.'));
              var extension = '.jpg';
            }
            var inputfile =
              this.galleryfolder +
              this.foldername +
              this.filename +
              '/' +
              subfile;
            var thumbfile =
              this.galleryfolder +
              this.foldername +
              this.filename +
              '/' +
              filename +
              '_thumb' +
              extension;
            console.log(inputfile);
            console.log(thumbfile);
            await photoThumbnail(inputfile, thumbfile);
          }
        }
        var inputfile =
          this.galleryfolder +
          this.foldername +
          this.filename +
          '/' +
          this.filename +
          '.jpg';
        var thumbfile =
          this.galleryfolder + this.foldername + this.filename + '_thumb.jpg';
        await photoThumbnail(inputfile, thumbfile);
      }

      this.newflag = true;
      this.thumbflag = true;
    }
  }
  async deleteImage() {
    console.log('del');
    var files = this.getServerPath();
    for (var file of files) {
      if (
        (this.getType() == 'folder' || this.getType() == '360') &&
        file.lastIndexOf('.') <= 0
      ) {
        try {
          await del(file);
        } catch (err) {
          console.error(err);
        }
      } else {
        try {
          fs.unlinkSync(file);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
}

module.exports = {
  GalleryImage: GalleryImage,
};
