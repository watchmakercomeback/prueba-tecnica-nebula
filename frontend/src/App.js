import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Requerido'),
  age: Yup.number().positive().integer().required('Requerido'),
  email: Yup.string().email('Email inválido').required('Requerido'),
});

function App() {
  const [persons, setPersons] = useState([]);

  const fetchPersons = () => {
    fetch(`${process.env.REACT_APP_API_URL}/persons`)
      .then(res => res.json())
      .then(data => setPersons(data));
  };

  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/persons/${id}`, {
      method: 'DELETE',
    }).then(fetchPersons);
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  return (
    <Container className="mt-10">
      <Typography variant="h4" gutterBottom>Gestión de Personas</Typography>

      <Paper className="p-6 mb-6">
        <Formik
          initialValues={{ name: '', age: '', email: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            fetch(`${process.env.REACT_APP_API_URL}/persons`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...values, age: Number(values.age) }),
            })
              .then(() => {
                fetchPersons();
                resetForm();
              });
          }}
        >
          {({ errors, touched }) => (
            <Form className="grid gap-4">
              <Field
                as={TextField}
                name="name"
                label="Nombre"
                error={touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
              <Field
                as={TextField}
                name="age"
                label="Edad"
                type="number"
                error={touched.age && !!errors.age}
                helperText={touched.age && errors.age}
              />
              <Field
                as={TextField}
                name="email"
                label="Email"
                error={touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <Button variant="contained" type="submit">Agregar Persona</Button>
            </Form>
          )}
        </Formik>
      </Paper>

      <Paper className="p-4">
        <Typography variant="h6">Lista de personas</Typography>
        <List>
          {persons.map((p) => (
            <ListItem
              key={p._id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(p._id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={`${p.name} - ${p.age} años - ${p.email}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default App;
