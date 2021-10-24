import express from 'express';
var router = express.Router();
router.get('/sitemap.xml', function(req, res) {
    res.sendFile('./sitemap.xml');
});