const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

// Login API
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Send phone OTP API
app.post('/send-phone-otp', async (req, res) => {
    const { phone } = req.body;
    const phoneOTP = '123456';
    res.status(200).json({ message: 'OTP sent to phone', otp: phoneOTP });
});

// Send email OTP API
app.post('/send-email-otp', async (req, res) => {
    const { email } = req.body;
    const emailOTP = '654321';
    res.status(200).json({ message: 'OTP sent to email', otp: emailOTP });
});

// Verify phone OTP API
app.post('/verify-phone-otp', async (req, res) => {
    const { otp } = req.body;
    const phoneOTP = '123456';
    if (otp === phoneOTP) {
        res.status(200).json({ message: 'Phone OTP verified successfully' });
    } else {
        res.status(400).json({ message: 'Incorrect phone OTP' });
    }
});

// Verify email OTP API
app.post('/verify-email-otp', async (req, res) => {
    const { otp } = req.body;
    const emailOTP = '654321';
    if (otp === emailOTP) {
        res.status(200).json({ message: 'Email OTP verified successfully' });
    } else {
        res.status(400).json({ message: 'Incorrect email OTP' });
    }
});

// Get form details API
app.post('/form-details', async (req, res) => {
    const { user_id } = req.body;
    try {
        const result = await pool.query('SELECT * FROM student_profiles WHERE user_id = $1', [user_id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Submit form API
app.post('/submit-form', async (req, res) => {
    const {
        user_id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        hometown,
        degree,
        course_length,
        course_started,
        expected_graduation,
        branch,
        minor_branch,
        cgpa,
        sgpa,
        class_12_board,
        class_12_percentage
    } = req.body;

    try {
        await pool.query(
            `INSERT INTO student_profiles (
                user_id, first_name, last_name, date_of_birth, gender, hometown, degree, course_length, course_started, expected_graduation,
                branch, minor_branch, cgpa, sgpa, class_12_board, class_12_percentage
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
            [
                user_id, first_name, last_name, date_of_birth, gender, hometown, degree, course_length, course_started, expected_graduation,
                branch, minor_branch, cgpa, sgpa, class_12_board, class_12_percentage
            ]
        );
        res.status(200).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get jobs API
app.get('/jobs', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jobs');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get job by ID API
app.get('/jobs/:id', async (req, res) => {
    const jobId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
