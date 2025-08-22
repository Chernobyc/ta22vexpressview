const express = require('express');
const router = express.Router();
const db = require('../models/index');
const paginate = require('../pagination');
const bcrypt = require('bcrypt');

// router.get('/test_session', (req, res) => {
//     res.json({
//         session: req.session,
//         sessionId: req.sessionID
//     });
// });
router.get('/login', async (req, res) => {
    res.render('auth/login.njk');
});
router.post('/login', async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.render('auth/login.njk', {
                error: 'Email and password are required'
            });
        }

        const user = await db.User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) {
            return res.render('auth/login.njk', {
                error: 'Invalid email or password',
                email: req.body.email
            });
        }

        const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
        
        if (!isPasswordValid) {
            return res.render('auth/login.njk', {
                error: 'Invalid email or password',
                email: req.body.email
            });
        }

        req.session.userId = user.id;
        req.session.user = user;

        return res.redirect('/');

    } catch (error) {
        console.error('Login error:', error);
        return res.render('auth/login.njk', {
            error: 'An error occurred during login'
        });
    }
});
router.get('/register', async (req, res) => {
    res.render('auth/register.njk');
});
router.post('/register', async (req, res) => {
    try {
        if (!req.body.name) {
            return res.render('auth/register.njk', {
                error: 'Name is required',
                name: req.body.name,
                email: req.body.email
            });
        }
        if (!req.body.email) {
            return res.render('auth/register.njk', {
                error: 'Email is required',
                name: req.body.name,
                email: req.body.email
            });
        }
        if (!req.body.password) {
            return res.render('auth/register.njk', {
                error: 'Password is required',
                name: req.body.name,
                email: req.body.email
            });
        }
        if (req.body.password !== req.body.password_confirm) {
            return res.render('auth/register.njk', {
                error: 'Passwords do not match',
                name: req.body.name,
                email: req.body.email
            });
        }

        let existingUser = await db.User.count({
            where: {
                email: req.body.email
            }
        });

        if (existingUser > 0) {
            return res.render('auth/register.njk', {
                error: 'User with this email already exists',
                name: req.body.name,
                email: req.body.email
            });
        }

        await db.User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 12)
        });

        // Automaticly login after registration
        const newUser = await db.User.findOne({
            where: {
                email: req.body.email
            }
        });
        req.session.userId = newUser.id;
        req.session.user = newUser;

        return res.redirect('/');

    } catch (error) {
        console.error('Registration error:', error);
        return res.render('auth/register.njk', {
            error: 'An error occurred during registration',
            name: req.body.name,
            email: req.body.email
        });
    }
});
// KASPAR CODE
// router.post('/register', async (req, res) => {
//     if(!req.body.name){
//        return res.redirect('/register');
//     }
//     if(!req.body.email){
//         return res.redirect('/register');
//     }
//     if(!req.body.password){
//         return res.redirect('/register');
//     }
//     let user = await db.User.count({
//         where: {
//             email: req.body.email
//         }
//     });

//     if(user>0){
//         return res.redirect('/register');
//     }
//     await db.User.create({
//         name: req.body.name,
//         email: req.body.email,
//         password: bcrypt.hashSync(req.body.password, 12)
//     });
//     return res.redirect('/');
// });
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.redirect('/');
    });
});
module.exports = router;