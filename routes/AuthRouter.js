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
const Response = require('../Response')
const { User, Plugin } = require('../database/models')

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
    const user = (await User.findOrCreate({
      where: {
        discordId: req.user.id
      },
      defaults: {
        name: `${req.user.username}#${req.user.discriminator}`,
        discordId: req.user.id,
        admin: false
      }
    }))[0]
    if(user.name !== `${req.user.username}#${req.user.discriminator}`) {
      user.update({
        name: `${req.user.username}#${req.user.discriminator}`
      })
      const plugins = await Plugin.findAll({
        where: {
          owner: user.id
        }
      })
      plugins.forEach((plugin) => {
        plugin.update({
          discordOwner: `${req.user.username}#${req.user.discriminator}`
        })
      })
    }
    // TODO: Redirect to frontend
    const token = Auth.generateToken(user, req.user)
    res.redirect(`${config.get('server.frontend')}/auth/callback?token=${encodeURIComponent(token)}`)
    /*return new Response(true, 'Token is in root', 200, {
      token
    })*/
  }))

router.route('/test')
  .get(Auth.middleware(false), aw(async (req, res, next) => {
    const token = req.token
    const user = req.user
    return new Response(true, 'Success', 200, {
      admin: user.admin,
      profile: token.profile,
      valid: true
    })
  }))
module.exports = router