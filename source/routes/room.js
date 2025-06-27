const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('../middlewares');
const {createRoom, removeRoom, enterRoom, sendFile} = require('../controllers/room');
const router = express.Router();

const path = require('path');
const fs = require('fs');
const multer = require('multer');

// 이미지 파일 담길 곳
try {
    fs.readdirSync('uploads');
} catch(err) {
    console.log('uploads 폴더가 없어 생성합니다.');
    fs.mkdirSync('uploads');
}

// multer 객체 생성
const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'uploads'); // ✅ uploads 폴더에 저장
      },
      filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + '-' + Date.now() + ext);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/', isLoggedIn, createRoom);
router.post('/:id/gif', isLoggedIn, upload.single('gif'), sendFile);
router.post('/:id/delete', isLoggedIn, removeRoom);
router.get('/:id', isLoggedIn, enterRoom);

module.exports = router;