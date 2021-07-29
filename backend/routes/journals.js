
const router = require('express').Router();
let Journal = require('../models/journal.model');

router.route('/').get((req, res) => {
  Journal.find()
    .then(journals => res.json(journals))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const title = req.body.title;
  const uid = req.body.uid;
  const authorName = req.body.authorName;
  const description = req.body.description;
  // const duration = Number(req.body.duration);
  // const date = Date.parse(req.body.date);

  const newJournal = new Journal({
    title,
    uid,
    authorName,
    description,
    // duration,
    // date,
  });

  newJournal.save()
  .then(() => res.json('Journal added!'))
  .catch(err => res.status(400).json('Error: ' + err));
});
// router.route('/:id').get((req, res) => {
//   Journal.findById(req.params.id)
//     .then(journal => res.json(journal))
//     .catch(err => res.status(400).json('Error: ' + err));
// });
// router.route('/:id').delete((req, res) => {
//   Journal.findByIdAndDelete(req.params.id)
//     .then(() => res.json('Journal deleted.'))
//     .catch(err => res.status(400).json('Error: ' + err));
// });
// router.route('/update/:id').post((req, res) => {
//   Journal.findById(req.params.id)
//     .then(journal => {
//       journal.username = req.body.username;
//       journal.description = req.body.description;
//       journal.duration = Number(req.body.duration);
//       journal.date = Date.parse(req.body.date);

//       journal.save()
//         .then(() => res.json('Journal updated!'))
//         .catch(err => res.status(400).json('Error: ' + err));
//     })
//     .catch(err => res.status(400).json('Error: ' + err));
// });
module.exports = router;