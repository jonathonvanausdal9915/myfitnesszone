const router = require('express').Router();
const { Workout, User } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', async(req, res) => {
    try {
        const workoutData = await Workout.findAll({
            include: [{
                model: User,
                attributes: ['name'],
            }, ],
        });

        const workouts = workoutData.map((workout) => workout.get({ plain: true }));

        res.render('login', {
            workouts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard', withAuth, async(req, res) => {
    try {
        console.log(req.session);
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Workout }]
        });

        const user = userData.get({ plain: true });

        res.render('dashboard', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/workout', withAuth, async(req, res) => {
    res.render('workout');
})

router.get('/profile', withAuth, async(req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
        });

        const user = userData.get({ plain: true });

        res.render('profile', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/signup', (req, res) => {
    res.render('signup')
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('/');
})

module.exports = router;