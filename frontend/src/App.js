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
import EditIcon from '@mui/icons-material/Edit';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Requerido'),
  age: Yup.number().positive().integer().required('Requerido'),
  email: Yup.string().email('Email inválido').required('Requerido'),
});

function App() {
  const [persons, setPersons] = useState([]);
  const [error, setError] = useState('');
  const [editingPerson, setEditingPerson] = useState(null);

  const fetchPersons = () => {
    fetch(`${process.env.REACT_APP_API_URL}/persons`)
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener personas');
        return res.json();
      })
      .then(data => {
        setPersons(data);
        setError('');
      })
      .catch(() => {
        setError('No se pudo conectar al servidor o hubo un error al cargar los datos');
      });
  };

  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/persons/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error();
        fetchPersons();
      })
      .catch(() => {
        setError('Error al eliminar la persona');
      });
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  return (
    <Container className="mt-10">
      <Typography variant="h4" gutterBottom>Gestión de Personas</Typography>

      {error && (
        <Paper className="p-4 mb-4 bg-red-100">
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      <Paper className="p-6 mb-6">
        <Typography variant="h6" gutterBottom>Agregar Persona</Typography>
        <Formik
          initialValues={{ name: '', age: '', email: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            fetch(`${process.env.REACT_APP_API_URL}/persons`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...values, age: Number(values.age) }),
            })
              .then(async (res) => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al agregar persona');
                fetchPersons();
                resetForm();
                setError('');
              })
              .catch((e) => {
                setError(e.message);
              })
              .finally(() => {
                setSubmitting(false);
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

      {editingPerson && (
        <Paper className="p-6 mb-6 bg-yellow-50">
          <Typography variant="h6" gutterBottom>Editar Persona</Typography>
          <Formik
            initialValues={{
              name: editingPerson.name,
              age: editingPerson.age,
              email: editingPerson.email,
            }}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={(values, { setSubmitting }) => {
              fetch(`${process.env.REACT_APP_API_URL}/persons/${editingPerson._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...values, age: Number(values.age) }),
              })
                .then(async (res) => {
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || 'Error al actualizar persona');
                  fetchPersons();
                  setEditingPerson(null);
                  setError('');
                })
                .catch((e) => {
                  setError(e.message);
                })
                .finally(() => {
                  setSubmitting(false);
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
                <div className="flex gap-4">
                  <Button variant="contained" color="primary" type="submit">Guardar Cambios</Button>
                  <Button variant="outlined" color="secondary" onClick={() => setEditingPerson(null)}>Cancelar</Button>
                </div>
              </Form>
            )}
          </Formik>
        </Paper>
      )}

      <Paper className="p-4">
        <Typography variant="h6">Lista de personas</Typography>
        <List>
          {persons.map((p) => (
            <ListItem
              key={p._id}
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => setEditingPerson(p)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(p._id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
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
