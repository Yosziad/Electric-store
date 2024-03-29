const express = require('express');
const controller = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');
const role = require('../helpers/role');

const router = express.Router();

router.post('/', controller.createUser);

router.post('/login', controller.loginUser);

router.post('/third-party-login', controller.loginNonMemberUser);

router.post('/logout', controller.logout);

router.delete('/:userId', checkAuth.authUser, checkAuth.authRole(role.User), checkAuth.userPermissionByID, controller.deleteUser);

module.exports = router;
