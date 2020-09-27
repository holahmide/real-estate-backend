const express = require('express')
const router = express.Router()
const { jwtAuth } = require('../middlewares')
const UserController = require('../controllers/UserController')
const BuildingController = require('../controllers/BuildingController')
const TenantController = require('../controllers/TenantController')
const PaymentController = require('../controllers/PaymentController')
const HomeController = require('../controllers/HomeController')

router.get('/', (req, res) => {
    res.send({
        message : "API Server Running",
        success : true
    })
})

//Home
router.get('/home', HomeController.index)

// Authentication
router.post('/auth/login', UserController.login)
router.post('/auth/register', jwtAuth.verifyToken, UserController.register)
router.get('/auth/state', jwtAuth.verifyToken, UserController.state)
// router.get('/refresh', jwtAuth.verifyRefreshToken, UserController.refresh)
router.post('/auth/refresh', jwtAuth.verifyRefreshToken, UserController.refresh)
router.post('/auth/update', jwtAuth.verifyToken, UserController.edit)


//Building
router.get('/buildings/all', jwtAuth.verifyToken, BuildingController.getBuildings)
router.get('/buildings/:id', jwtAuth.verifyToken, BuildingController.read)
router.post('/buildings/create', jwtAuth.verifyToken, BuildingController.create)
router.put('/buildings/update/:id', jwtAuth.verifyToken, BuildingController.update)
router.delete('/buildings/delete/:id', jwtAuth.verifyToken, BuildingController.delete)
//>>>Section
router.get('/sections/all', jwtAuth.verifyToken, BuildingController.getSections)
router.get('/sections/:id', jwtAuth.verifyToken, BuildingController.readSection)
router.post('/sections/create', jwtAuth.verifyToken, BuildingController.createSection)
router.put('/sections/update/:id', jwtAuth.verifyToken, BuildingController.updateSection)
router.delete('/sections/delete/:id', jwtAuth.verifyToken, BuildingController.deleteSection)


//Tenant
router.get('/tenants/all', jwtAuth.verifyToken, TenantController.getTenants)
router.get('/tenants/:id', jwtAuth.verifyToken, TenantController.readTenant)
router.post('/tenants/create', jwtAuth.verifyToken, TenantController.createTenant)
router.patch('/tenants/update/:id', jwtAuth.verifyToken, TenantController.updateTenant)
router.delete('/tenants/delete/:id', jwtAuth.verifyToken, TenantController.deleteTenant)
//>>>Plan
router.get('/plans/all', jwtAuth.verifyToken, TenantController.getPlans)
router.get('/plans/:id', jwtAuth.verifyToken, TenantController.readPlan)
router.post('/plans/create', jwtAuth.verifyToken, TenantController.createPlan)
router.patch('/plans/update/:id', jwtAuth.verifyToken, TenantController.updatePlan)
router.post('/plans/renew', jwtAuth.verifyToken, TenantController.renewPlan)
router.delete('/plans/delete/:id', jwtAuth.verifyToken, TenantController.deletePlan)


//Payment
router.get('/payments/all', jwtAuth.verifyToken, PaymentController.getPayments)
// router.get('/promises/:id', jwtAuth.verifyToken, PaymentController.readPromise)
router.post('/payments/create', jwtAuth.verifyToken, PaymentController.createPayment)
router.patch('/payments/update/:id', jwtAuth.verifyToken, PaymentController.updatePayment)
router.delete('/payments/delete/:id', jwtAuth.verifyToken, PaymentController.deletePayment)
//>>>Promises
router.get('/promises/all', jwtAuth.verifyToken, PaymentController.getPromises)
router.get('/promises/:id', jwtAuth.verifyToken, PaymentController.readPromise)
router.post('/promises/create', jwtAuth.verifyToken, PaymentController.createPromise)
router.patch('/promises/update/:id', jwtAuth.verifyToken, PaymentController.updatePromise)
router.delete('/promises/delete/:id', jwtAuth.verifyToken, PaymentController.deletePromise)

module.exports = router