// Création du routeur
const express = require('express');
const router = express.Router();
// Ajout des middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// Récupération du controllers Sauce
const sauceCtrl = require('../controllers/sauce');

// Router permettant l'accès vers l'app la fonction getAllSauce
router.get('/', auth, sauceCtrl.getAllSauce)
// Router permettant l'accès vers l'app la fonction createSauce
router.post('/', auth, multer, sauceCtrl.createSauce)
// Router permettant l'accès vers l'app la fonction getOneSauce
router.get('/:id', auth, sauceCtrl.getOneSauce)
//Router permettant l'accès vers l'app la fonction getOneSauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce)
// Router permettant l'accès vers l'app la fonction deleteSauce
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce)
// Router permettant l'accès vers l'app la fonction likeOrDislikeSauce
router.post('/:id/like', auth, sauceCtrl.likeSauce)

module.exports = router;
