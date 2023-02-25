const { request, response } = require("express");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :body"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

//fetches all persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});
//fetches a person based on ID
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404);
    response
      .send(
        `error 404 <br />
       Could not find the person with the id of ${id}`
      )
      .end();
  }
});

//deletes a person
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((note) => note.id !== id);

  response.status(204);
  response.send(`deleted ${id}`).end();
});

const getRandomId = () => {
  const maxId =
    persons.length > 0
      ? Math.floor(Math.random(...persons.map((n) => n.id)) * 1000)
      : 0;
  return maxId + 1;
};
// creates a  new phonebook entryu
app.post("/api/persons/", (request, response) => {
  const body = request.body;

  const person = {
    id: getRandomId(),
    name: body.name,
    number: body.number,
  };
  if (!body.number || !body.name) {
    return response.status(422).json({
      error: "please input a number and a name ",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    console.log("name must be unique");
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  persons = persons.concat(person);
  response.json(person);
});

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.get("/info", (request, response) => {
  const utcDate = new Date(Date.now());
  response.send(
    `<p> Phonebook has info for ${
      persons.length
    } people </p> <p> ${utcDate.toUTCString()}</p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});