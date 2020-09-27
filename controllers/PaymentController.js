const Op = require('sequelize').Op;
const { Tenant, Plan, Section, Payment, Promises, User, sequelize } = require('../models')

class PaymentController {
    static async createPayment(req, res) {
        if(!req.body.date || !req.body.amount || !req.body.plan_id) {
            return res.status(400).send({
                success: false,
                message : "Payment Basic informations incomplete"
            })
        }

        const plan = await Plan.findByPk(req.body.plan_id)
        if(!plan) {
            return res.status(400).send({
                success: false,
                message : "Plan specified does not exist"
            })
        }

        const t = await sequelize.transaction()
        try {
            const payment = await Payment.create(req.body)
            const paymentDetails = await Payment.findOne({
                where : { id : payment.id },
                include: [
                    { model : Plan, include : [ Tenant, Payment, {model : Section, where :{ active : true}, required : false } ] },
                    { model : User }
                ],
            });
            if(payment) {
                await t.commit()
                return res.status(200).send({
                    success : true,
                    message : "Successfully recorded payment",
                    payment : paymentDetails
                })
            }
        } catch (error) {
            await t.rollback()
            return res.status(400).send({
                success : false,
                message : "Unable to create payment",
                error : error.toString() || "Failed"
            })
        }
    }

    static async getPayments (req, res) {
        try {
            const payments = await Payment.findAll({ 
                // where : { active : true },
                include: [
                    { model : Plan, include : [ Tenant, Section ] },
                    {model : User }
                ],
            });
            if(payments){
                return res.status(200).send({
                    message : "Successfully fetched payments",
                    success : true,
                    payments
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to fetch payments",
                error : error.toString() || "Failed"
            })
        }
    }

    static async updatePayment (req, res) {
        const t = await sequelize.transaction()
        try {
            const updatePayment = await Payment.update(
                req.body,
                {  
                    where : { id : req.params.id },
                }
            );
            const payment = await Payment.findByPk(req.params.id)
            if(updatePayment && payment){
                await t.commit()
                return res.status(200).send({
                    message : "Successfully updated payment information",
                    success : true,
                    payment
                })
            }

        } catch (error) {
            await t.rollback()
            return res.status(400).send({
                success : false,
                message : "Unable to update payment information",
                error : error.toString() || "Failed"
            })
        }
    }

    static async deletePayment (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Payment not found",
                success : false
            })
        }

        const findPayment = await Payment.findByPk(req.params.id)
        if(!findPayment) {
            return res.status(400).send({
                message : "Payment not found",
                success : false
            })
        }

        try {
            const deletePayment = await Payment.destroy({where :{id : req.params.id }})
            if(deletePayment){
                return res.status(200).send({
                    message : "Successfully deleted payment",
                    success : true,
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to delete payment",
                error : error.toString() || "Failed"
            })
        }
    }

    /////Promises
    static async createPromise (req, res) {
        // if(!req.body.date || !req.body.plan_id) {
        if((!req.body.date && !req.body.amount) || !req.body.plan_id) {
            return res.status(400).send({
                success: false,
                message : "Promised date not found"
            })
        }

        const plan = await Plan.findByPk(req.body.plan_id)
        if(!plan) {
            return res.status(400).send({
                success: false,
                message : "Plan specified does not exist"
            })
        }

        const t = await sequelize.transaction()
        try {
            const promise = await Promises.create(req.body)
            const promiseDetails = await Promises.findOne({
                where : { id : promise.id },
                include: [
                    { model : Plan, include : [ Section, Tenant] },
                ],
            });
            if(promise) {
                await t.commit()
                return res.status(200).send({
                    success : true,
                    message : "Successfully recorded promise",
                    promise : promiseDetails
                })
            }
        } catch (error) {
            await t.rollback()
            return res.status(400).send({
                success : false,
                message : "Unable to record promise",
                error : error.toString() || "Failed"
            })
        }
    }

    static async getPromises (req, res) {
        try {
            const promises = await Promises.findAll({ 
                where : { fufilled : false },
                include: [
                    { model : Plan, include : [ Section, Tenant] },
                ],
            });
            if(promises){
                return res.status(200).send({
                    message : "Successfully fetched promises",
                    success : true,
                    promises
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to fetch promises",
                error : error.toString() || "Failed"
            })
        }
    }

    static async readPromise (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Promise not found",
                success : false
            })
        }


        try {
            const promise = await Promises.findOne({
                where : { id : req.params.id },
                include: [
                    { model : Plan, include : [ Section] },
                ],
            })
            if(promise){
                return res.status(200).send({
                    message : "Successfully fetched promise's information",
                    success : true,
                    promise
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to get promise's information",
                error : error.toString() || "Failed"
            })
        }
    }

    static async updatePromise (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Promise not found",
                success : false
            })
        }

        const findPromise = await Promises.findByPk(req.params.id)
        if(!findPromise) {
            return res.status(400).send({
                message : "Promise not found",
                success : false
            })
        }

        const t = await sequelize.transaction()
        try {
            const updatePromise = await Promises.update(
                req.body,
                {  
                    where : { id : req.params.id },
                }
            );
            const promise = await Promises.findByPk(req.params.id)
            if(updatePromise && promise){
                await t.commit()
                return res.status(200).send({
                    message : "Successfully updated promise information",
                    success : true,
                    promise
                })
            }

        } catch (error) {
            await t.rollback()
            return res.status(400).send({
                success : false,
                message : "Unable to update promise information",
                error : error.toString() || "Failed"
            })
        }
    }

    static async deletePromise (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Promise not found",
                success : false
            })
        }

        const findPromise = await Promises.findByPk(req.params.id)
        if(!findPromise) {
            return res.status(400).send({
                message : "promise not found",
                success : false
            })
        }

        try {
            const deletePromise = await Promises.destroy({where :{id : req.params.id }})
            if(deletePromise){
                return res.status(200).send({
                    message : "Successfully deleted tenant promise",
                    success : true,
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to delete tenant promise",
                error : error.toString() || "Failed"
            })
        }
    }
}

module.exports = PaymentController