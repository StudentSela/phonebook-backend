const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(express.json());
app.use(morgan('tiny')); 
app.use(cors());


let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
      id: 2,
      name: "Ada lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number:"39-23-6423122"
    }
  ]

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number is missing' 
      });
    }
  
    if (persons.find(person => person.name === body.name)) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      });
    }
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

  app.get('/info',(request, response) => {
    const date = new Date();
    const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`;
    response.send(info);
});

  app.get('/api/persons', (request, response) => {
    response.json(persons);
  });
  
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
  
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });