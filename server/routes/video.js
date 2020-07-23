const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

//----------------------------------
//    Video
//----------------------------------

// Storage multer config
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");    
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        if(ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({ storage: storage}).single("file");

// upload file
router.post('/uploadfiles', (req, res) => {
    // 비디오를 서버에 저장
    upload(req, res, err => {
        if(err) {
            return res.json({ success: false, err });
        }

        return res.json({ success: true, url: res.req.file.path, filemName: res.req.file.filename })
    })

})

// thumnail
router.post('/thumnail', (req, res) => {
    // 썸네일 생성하고 비디오 러닝타임도 가져오기
    let filePath = "";
    let fileDuration = "";

    // 비디어 정보 가져오기
    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);

        fileduration = metadata.format.duration;
    });

    // 썸네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '));
            console.log(filenames);

            filePath = "uploads/thumnails/" + filenames[0];
        })
        .on('end', function () {
            console.log('Screenshots taken');

            return res.json({ success: true, url: filePath, fileDuration: fileDuration });
        })
        .on('error', function (err) {
            console.error(err);
            return res.json({ success: false, err});
        })
        .screenshots({
            count: 1,
            folder: 'uploads/thumnails',
            size: '320x240',
            filename: 'thumnail-%b.png'
        })
})

// upload video
router.post('/uploadVideo', (req, res) => {
    // 비디오 정보 저장
    const video = new Video(req.body);

    video.save((err, doc) => {
        if(err) 
            return res.json({ success: false, err});

        res.status(200).json({ success: true});
    });
})

module.exports = router;