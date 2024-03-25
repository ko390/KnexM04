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


// SELECT ALL
router.get('/select', async (req, res) => {
    try {
        const ligas = await knex.select().from('Ligas');
        res.render('ligas', { ligas });
    } catch (error) {
        console.error('Error al obtener las ligas:', error);
        res.status(500).send('Error al obtener las ligas');
    }
});

// SELECT BY ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const liga = await knex('Ligas').where({ id }).first();
        if (!liga) {
            return res.status(404).send('Liga no encontrada');
        }
        res.status(200).json(liga);
    } catch (error) {
        console.error('Error al obtener la liga:', error);
        res.status(500).send('Error al obtener la liga');
    }
});

// CREATE
router.post('/', async (req, res) => {
    try {
        await knex('Ligas').insert(req.body);
        res.status(201).send('Liga creada correctamente');
    } catch (error) {
        console.error('Error al crear la liga:', error);
        res.status(500).send('Error al crear la liga');
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const ligaData = req.body;
    try {
        const updated = await knex('Ligas').where({ id }).update(ligaData);
        if (!updated) {
            return res.status(404).send('Liga no encontrada');
        }
        res.status(200).send('Liga actualizada correctamente');
    } catch (error) {
        console.error('Error al actualizar la liga:', error);
        res.status(500).send('Error al actualizar la liga');
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await knex('Ligas').where({ id }).del();
        if (!deleted) {
            return res.status(404).send('Liga no encontrada');
        }
        res.status(200).send('Liga eliminada correctamente');
    } catch (error) {
        console.error('Error al eliminar la liga:', error);
        res.status(500).send('Error al eliminar la liga');
    }
});

module.exports = router;
