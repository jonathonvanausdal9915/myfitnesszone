const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async(req, res) => {
    console.log("yes");
    try {
        const userData = await user.create(req.body);
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    console.log("login")
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });

        if (!userData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);


        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'Logged in' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
    res
        .status(400)
        .json({ message: 'Incorrect email or password' });
    return;
});

module.exports = router;