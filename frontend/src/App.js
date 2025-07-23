import React, { useEffect, useState } from 'react';

function App() {
  const [persons, setPersons] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', email: '' });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/persons`)
      .then(res => res.json())
      .then(data => setPersons(data));
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/persons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, age: Number(form.age) }),
    })
      .then(res => res.json())
      .then(() => {
        setForm({ name: '', age: '', email: '' });
        return fetch(`${process.env.REACT_APP_API_URL}/persons`);
      })
      .then(res => res.json())
      .then(data => setPersons(data));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Personas</h1>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
        <input name="age" placeholder="Edad" type="number" value={form.age} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <button type="submit">Agregar</button>
      </form>

      <ul>
        {persons.map(p => (
          <li key={p._id}>{p.name} - {p.age} años - {p.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
