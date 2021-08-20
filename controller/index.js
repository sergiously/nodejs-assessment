'use strict';

const express   = require('express');
const router    = express.Router();

const auth      = require('../domain/services/service-auth');
const policies  = require('../domain/services/policies');
const clients   = require('../domain/services/clients');

router.post("/login", auth.Login);
router.get("/policies", policies.GetAll);
router.get("/policies/:id", policies.GetById);
router.get("/clients", clients.GetAll);
router.get("/clients/:id", policies.GetById);
router.get("/clients/:id/policies", clients.GetPolicies);

module.exports = router;