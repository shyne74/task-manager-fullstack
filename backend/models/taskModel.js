const { pool } = require('../config/db');

const createTask = async (task) => {
    const { title, description, status, priority, due_date, assigned_to, files } = task;
    const result = await pool.query(
        `INSERT INTO tasks (title, description, status, priority, due_date, assigned_to, files) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, description, status, priority, due_date, assigned_to, files]
    );
    return result.rows[0];
};

const getTasks = async (filters = {}, userId, isAdmin) => {
    let query = 'SELECT * FROM tasks';
    const conditions = [];
    const values = [];

    if (!isAdmin) {
        conditions.push('assigned_to = $' + (values.length + 1));
        values.push(userId);
    }

    if (filters.status) {
        conditions.push('status = $' + (values.length + 1));
        values.push(filters.status);
    }
    if (filters.priority) {
        conditions.push('priority = $' + (values.length + 1));
        values.push(filters.priority);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY due_date ASC';

    const result = await pool.query(query, values);
    return result.rows;
};

const getTaskById = async (id) => {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0];
};

const updateTask = async (id, updates) => {
    const { title, description, status, priority, due_date, assigned_to, files } = updates;
    const result = await pool.query(
        `UPDATE tasks SET title=$1, description=$2, status=$3, priority=$4, due_date=$5, assigned_to=$6, files=$7 
 WHERE id=$8 RETURNING *`,

        [title, description, status, priority, due_date, assigned_to, files, id]
    );
    return result.rows[0];
};

const deleteTask = async (id) => {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};