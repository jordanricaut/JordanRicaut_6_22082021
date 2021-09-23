// Récupère le modele Sauce
const Sauce = require('../models/Sauce')
// importation du module fs pour gerer la modification et la suppresion des images
const fs = require('fs')

// Récupération de toutes les sauces disponibles
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};
// Récupération d'une sauce en fonction de son id
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};
// Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

// Suppresion d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


// Like et dislike
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    // Si l'user n'est pas dans le tableau usersDisliked ni dans usersLiked
    if (sauce.usersDisliked.indexOf(req.body.userID) == -1 && sauce.usersLiked.indexOf(req.body.userID) == -1) {
      if (req.body.like == 1) {
        sauce.usersLiked.push(req.body.userId);
        sauce.likes += req.body.like;
        console.log('Like et user ajouté');
      }
      else if (req.body.like == -1) {
        sauce.usersDisliked.push(req.body.userId);
        sauce.dislikes -= req.body.like;
        console.log('Dislike et user ajouté');
      }
    }
    // Si l'user est dans le tableau usersLiked
    if (sauce.usersLiked.indexOf(req.body.userId) != -1) {
      const userIndex = sauce.usersLiked.findIndex(user => user == req.body.userId);
      sauce.usersLiked.splice(userIndex, 1);
      sauce.likes -= 1;
      console.log('Like et user supprimés');
    }
    if (sauce.usersDisliked.indexOf(req.body.userId) != -1) {
      const userIndex = sauce.usersDisliked.findIndex(user => user === req.body.userId);
      sauce.usersDisliked.splice(userIndex, 1);
      sauce.dislikes -= 1;
      console.log('Dislike et user supprimés');
    }
    sauce.save();
    res.status(201).json({ message: 'Like modifié !'});
  })
  .catch(error => res.status(500).json({ error }));
};
