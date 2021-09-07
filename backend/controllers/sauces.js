const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  console.log('createSauce'); 
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    console.log(sauceObject);
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0
    });
    console.log(sauce);
    sauce.save()
      .then(() => res.status(201).json({ message: ' Enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.getOneSauce = (req, res, next) => { // Logique  pour: router.get('/api/sauces/:id')
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

exports.modifySauce = (req, res, next) => { // Logique pour: router.put('/api/sauces/:id')
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body }; //  ... = syntax de deconstruction, pour simplifier l'écriture et l'enregistrement en base de donnée
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) 
      .then(() => res.status(200).json({ message: 'Changements effectués!'}))
      .catch(error => res.status(400).json({ error }));
  };

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

exports.getAllSauces = (req, res, next) => {
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
exports.likeSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => {
    console.log(sauce);
    if(req.body.like === 1) {
      if(sauce.usersLiked.indexOf(req.body.userId) === -1) {
        sauce.likes++
        sauce.usersLiked.push(req.body.userId);
      }
      else {
        res.status(409).json({error: req.body.userId + ' a déjà liker la sauce'});      
      }
    }
    if(req.body.like === -1) {
      if(sauce.usersDisliked.indexOf(req.body.userId) === -1) {
        sauce.dislikes++
        sauce.usersDisliked.push(req.body.userId)
      }
      else if(sauce.usersDisliked.indexOf(req.body.userId) > -1) {
        res.status(409).json({error: req.body.userId + ' a déjà disliker la sauce'});
      }
    }
    if(req.body.like === 0) {
      const likesContainer = sauce.usersLiked.indexOf(req.body.userId)
      const dislikesContainer = sauce.usersDisliked.indexOf(req.body.userId)
      if(sauce.usersLiked.indexOf(req.body.userId) >= 0) {
        sauce.likes--
        sauce.usersLiked.splice(likesContainer, 1) 
      }
        else if(sauce.usersDisliked.indexOf(req.body.userId) >= 0) {
          sauce.dislikes--
          sauce.usersDisliked.splice(dislikesContainer, 1)
        }
    }
    sauce.save() 
    .then(() => res.status(200).json({  message: 'Sauce modifiée!'}))
    .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(400).json({ error }));
  
  console.log(req.body);
}