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
const { bodyChecker } = require('../middleware')
const bodyParser = require('body-parser')
const config = require('config')
const express = require('express')
const passport = require('passport')
const Response = require('../Response')
const { ServerError, PackageNotFoundError, ParameterNotDefinedError, UnauthorizedError, PackageNotApprovedError, NoBodyError, BodyParamMissingError } = require('../errors')
const { User, Plugin } = require('../database/models')

const UUID_MATCH = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const router = express.Router()

router.use(bodyParser.json())

function pluginToObj(plugin) {
  return {
    id: plugin.id,
    name: plugin.name,
    description: plugin.description,
    owner: plugin.owner,
    discordOwner: plugin.discordOwner,
    version: plugin.version,
    approved: plugin.approved,
    styles: plugin.styles,
    archive: plugin.isStyle ? undefined : plugin.archive,
    verified: plugin.verified,
    isStyle: plugin.isStyle,
    downloads: Array.isArray(plugin.downloads) ? plugin.downloads.length : 0
  }
}

router.route('/')
  .get(aw(async (req, res, next) => {
    const _plugins = await Plugin.findAll({
      where: {
        approved: true,
        deleted: false,
        unlisted: false
      }
    })
    const plugins = []
    _plugins.forEach((plugin) => plugins.push(pluginToObj(plugin)))
    return new Response({
      plugins
    })
  }))

router.route('/owned')
  .get(Auth.middleware(false), aw(async (req, res, next) => {
    const _plugins = await Plugin.findAll({
      where: {
        owner: req.user.id
      }
    })
    const plugins = []
    _plugins.forEach((plugin) => plugins.push(pluginToObj(plugin)))
  }))

router.route('/:id')
  .get(aw(async (req, res, next) => {
    if (typeof req.params.id !== 'string') throw new ParameterNotDefinedError('id')
    const pkgId = req.params.id
    if (!UUID_MATCH.test(pkgId)) throw new PackageNotFoundError(pkgId)
    const plugin = await Plugin.findById(pkgId)
    if (!plugin) throw new PackageNotFoundError(pkgId)
    if (!plugin.approved) throw new PackageNotApprovedError()
    return new Response(pluginToObj(plugin))
  }))
  .patch(Auth.middleware(false), aw(async (req, res, next) => {
    if (typeof req.params.id !== 'string') throw new ParameterNotDefinedError('id')
    const pkgId = req.params.id
    if (!UUID_MATCH.test(pkgId)) throw new PackageNotFoundError(pkgId)
    const plugin = await Plugin.findById(pkgId)
    if (!plugin) throw new PackageNotFoundError(pkgId)
    const hasAccess = (plugin.owner === req.user.id || req.user.admin)
    if (!hasAccess) throw new UnauthorizedError()
    const body = req.body
    let update = {
      name: body.name,
      description: body.description,
      unlisted: body.unlisted,
      archive: body.archive,
      styles: body.styles,
      version: body.version
    }
    if (req.user.admin) {
      update.verified = body.verified
      update.approved = body.approved
    }
    plugin.update(update)
    return new Response(true, 'Updated', 200, {
      updated: true,
      id: plugin.id
    })
  }))
  .delete(Auth.middleware(false), aw(async (req, res, next) => {
    if (typeof req.params.id !== 'string') throw new ParameterNotDefinedError('id')
    const pkgId = req.params.id
    if (!UUID_MATCH.test(pkgId)) throw new PackageNotFoundError(pkgId)
    const plugin = await Plugin.findById(pkgId)
    if (!plugin) throw new PackageNotFoundError(pkgId)
    const hasAccess = (plugin.owner === req.user.id || req.user.admin)
    if (!hasAccess) throw new UnauthorizedError()
    plugin.update({
      deleted: true
    })
    return new Response({
      deleted: true
    })
  }))

router.route('/:id/download')
  .get(Auth.middleware(false), aw(async (req, res, next) => {
    if (typeof req.params.id !== 'string') throw new ParameterNotDefinedError('id')
    const pkgId = req.params.id
    if (!UUID_MATCH.test(pkgId)) throw new PackageNotFoundError(pkgId)
    const plugin = await Plugin.findById(pkgId)
    if (!plugin) throw new PackageNotFoundError(pkgId)
    if (!plugin.approved) throw new PackageNotApprovedError()
    const downloads = plugin.downloads || []
    if (downloads.indexOf(req.user.id) !== -1) return new Response(true, 'Already tracked download', 200, {})
    downloads.push(req.user.id)
    plugin.update({
      downloads
    })
    return new Response(true, 'Tracked download', 200, {
      downloads: downloads.length
    })
  }))

router.route('/create')
  .put(Auth.middleware(false), bodyChecker([
    'name',
    'version',
    {
      name: 'isStyle',
      type: 'boolean'
    },
    'description'
  ]), aw(async (req, res, next) => {
    if (req.body.isStyle) {
      if (typeof req.body.styles !== 'string') throw new ParameterNotDefinedError('styles')
    } else {
      if (typeof req.body.archive !== 'string') throw new ParameterNotDefinedError('archive')
    }
    const plugin = await Plugin.create({
      name: req.body.name,
      version: req.body.version,
      description: req.body.description,
      isStyle: req.body.isStyle,
      archive: req.body.isStyle ? undefined : req.body.archive,
      styles: req.body.isStyle ? req.body.styles : undefined,
      owner: req.user.id,
      discordOwner: req.user.name
    })
    return new Response(true, 'Created', 200, {
      created: true,
      id: plugin.id
    })
  }))

module.exports = router