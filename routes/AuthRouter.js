/**
 * Custocord Registry Backend
 * 
 * File...................AuthRouter.js
 * Created on.............Friday, 29th December 2017 11:05:22 am
 * Created by.............Relative
 * 
 */
const Auth = require('../Auth')
const config = require('config')
const express = require('express')
const passport = require('passport')
const { User } = require('../database/models')

const aw = require('../awrap')
const router = express.Router()

router.route('/')
  .get(passport.authenticate('discord', {
    session: false
  }))
router.route('/callback')
  .get(passport.authenticate('discord', {
    failureRedirect: '/auth/failed',
    session: false
  }), aw(async (req, res, next) => {
    const user = await User.findOrCreate({
      where: {
        discordId: req.user.id
      },
      defaults: {
        name: req.user.username,
        discordId: req.user.id,
        admin: false
      }
    })
    const token = Auth.generateToken(user[0] || user, req.user)
    return res.json({
      meta: {
        status: 200,
        success: true,
        message: 'Your token is at "token"'
      },
      token
    })
  }))

module.exports = router