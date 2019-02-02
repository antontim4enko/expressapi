var express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//const logger = require("morgan");
const Note = require("./note");


const API_PORT = 5000;
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET", "PUT", "POST", "DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', function (req, res) {
    res.send('Hello World');
});


const dbRoute = 'mongodb://admin:my-notes-admin1@ds137661.mlab.com:37661/my-notes';

mongoose.connect(
    dbRoute,
    { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));


router.get("/getData", (req, res) => {
    Note.find(function (err, data) {
        if (err) return console.error(err);
        res.json(data);
    })
});

router.post("/putData", (req, res) => {
    var note = new Note();
    note.id = req.body.id;
    note.text = req.body.text;

    note.save(function (err) {
        if (err)
            res.send(err);

        res.json({ message: 'note created!' });
    });

});

router.put("/updateNote", (req, res) => {
    Note.findById(req.body.id, (err, note) => {
        if (err) res.send(err);

        note.text = req.body.text;

        note.save(err => {
            if (err) res.send(err);
            res.json({ message: 'Note updated' })
        })
    })
})

router.get('/note/:id', (req, res) => {
    Note.findById(req.params.id, (err, note) => {

        if (err) res.send(err);

        res.json(note);
    })
})


router.delete('/note/:id', (req, res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        Note.deleteOne({
            _id: req.params.id
        }, function (err, note) {
            if (err)
                res.send(err);
            res.json({
                message: 'note deleted'
            });
        });
    })


app.use("/api", router);


// launch our backend into a port
app.listen(process.env.PORT || API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
