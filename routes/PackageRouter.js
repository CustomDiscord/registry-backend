/**
 * Custocord Registry Backend
 * 
 * File...................PackageRouter.js
 * Created on.............Friday, 29th December 2017 12:08:34 pm
 * Created by.............Relative
 * 
 */
const Auth = require('../Auth')
const aw = require('../awrap')
const config = require('config')
const express = require('express')
const passport = require('passport')
const Response = require('../Response')
const { ServerError, PackageNotFoundError, ParameterNotDefinedError, UnauthorizedError } = require('../errors')
const { User, Plugin } = require('../database/models')

const UUID_MATCH = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const router = express.Router()

router.route('/:id')
  .get(aw(async (req, res, next) => {
    if (typeof req.params.id !== 'string') throw new ParameterNotDefinedError('id')
    const pkgId = req.params.id
    if (!UUID_MATCH.test(pkgId)) throw new PackageNotFoundError(pkgId)
    const plugin = await Plugin.findById(pkgId)
    if (!plugin) throw new PackageNotFoundError(pkgId)
  }))
  .delete(Auth.middleware(false), aw(async (req, res, next) => {
    if (typeof req.params.id !== 'string') throw new ParameterNotDefinedError('id')
    const pkgId = req.params.id
    const plugin = await Plugin.findById(pkgId)
    if (!plugin) throw new PackageNotFoundError(pkgId)
    const hasAccess = (plugin.owner === req.user.id || req.user.admin)
    if (!hasAccess) throw new UnauthorizedError()
    plugin.update({
      deleted: true
    })
    return res.status(200).json(new Response({
      deleted: true
    }))
  }))

module.exports = router