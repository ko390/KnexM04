const express = require('express');
const router = express.Router();
const path = require('path');
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, '../FutBall.sqlite')
    },
    useNullAsDefault: true,
});

// Select All
router.get('/select', async (req, res) => {
    try {
        const equipos = await knex.select().from('Equipos');
        res.render('equipos', { equipos });
    } catch (error) {
        console.error('Error al obtener los equipos:', error);
        res.status(500).send('Error al obtener los equipos');
    }
});

// Select by ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const equipo = await knex('Equipos').where({ id }).first();
        if (!equipo) {
            return res.status(404).send('Equipo no encontrado');
        }
        res.status(200).json(equipo);
    } catch (error) {
        console.error('Error al obtener el equipo:', error);
        res.status(500).send('Error al obtener el equipo');
    }
});

// CREATE
router.post('/nuevo', async (req, res) => {
    const { nombre, pais, ciudad, imagen, liga } = req.body;
    try {
        const [equipo_id] = await knex('Equipos').insert({ nombre, pais, ciudad, imagen });

        await knex('Equipo_Liga').insert({ equipo_id, liga_id: liga });

        res.status(201).redirect('/equipos');
    } catch (error) {
        console.error('Error al crear el equipo:', error);
        res.status(500).send('Error al crear el equipo');
    }
});

// UPDATE
router.post('/:id/editar', async (req, res) => {
    const id = req.params.id;
    const { nombre, pais, ciudad, imagen, liga } = req.body;
    try {
        await knex('Equipos').where({ id }).update({ nombre, pais, ciudad, imagen });

        await knex('Equipo_Liga').where({ equipo_id: id }).update({ liga_id: liga });

        res.redirect('/equipos');
    } catch (error) {
        console.error('Error al actualizar el equipo:', error);
        res.status(500).send('Error al actualizar el equipo');
    }
});
// DELETE
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await knex('Equipos').where({ id }).del();
        if (!deleted) {
            return res.status(404).send('Equipo no encontrado');
        }
        res.status(200).send('Equipo eliminado correctamente');
    } catch (error) {
        console.error('Error al eliminar el equipo:', error);
        res.status(500).send('Error al eliminar el equipo');
    }
});

module.exports = router;