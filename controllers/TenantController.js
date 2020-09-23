const Op = require('sequelize').Op;
const { Tenant, Plan, Section, Payment, Promises, sequelize } = require('../models')

class TenantController {
    static async createTenant (req, res) {
        if(!req.body.email || !req.body.firstname || !req.body.lastname || !req.body.phone) {
            return res.status(400).send({
                success: false,
                message : "Tenant Basic information incomplete"
            })
        }

        const t = await sequelize.transaction()
        try {
            const tenant = await Tenant.create(req.body)
            if(tenant) {
                await t.commit()
                return res.status(200).send({
                    success : true,
                    message : "Successfully registered tenant",
                    tenant
                })
            }
        } catch (error) {
            await t.rollback()
            return res.status(400).send({
                success : false,
                message : "Unable to register tenant",
                error : error.toString() || "Failed"
            })
        }
    }

    static async getTenants (req, res) {
        try {
            const tenants = await Tenant.findAll({ 
                // where : { active : true },
                include: [
                    { model : Plan, include : [ Section] },
                ],
            });
            if(tenants){
                return res.status(200).send({
                    message : "Successfully fetched tenants",
                    success : true,
                    tenants
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to fetch tenants",
                error : error.toString() || "Failed"
            })
        }
    }

    static async readTenant (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Tenant not found",
                success : false
            })
        }


        try {
            const tenant = await Tenant.findOne({
                where : { id : req.params.id },
                include: [
                    { model : Plan, include : [ Section] },
                ],
            })
            if(tenant){
                return res.status(200).send({
                    message : "Successfully fetched tenant's information",
                    success : true,
                    tenant
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to get tenant's information",
                error : error.toString() || "Failed"
            })
        }
    }

    static async updateTenant (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Tenant not found",
                success : false
            })
        }

        const findTenant = await Tenant.findByPk(req.params.id)
        if(!findTenant) {
            return res.status(400).send({
                message : "Tenant not found",
                success : false
            })
        }

        const t = await sequelize.transaction()
        try {
            const updateTenant = await Tenant.update(
                req.body,
                {  
                    where : { id : req.params.id },
                }
            );
            const tenant = await Tenant.findByPk(req.params.id)
            if(updateTenant && tenant){
                await t.commit()
                return res.status(200).send({
                    message : "Successfully updated tenant information",
                    success : true,
                    tenant
                })
            }

        } catch (error) {
            await t.rollback()
            return res.status(400).send({
                success : false,
                message : "Unable to update tenant information",
                error : error.toString() || "Failed"
            })
        }
    }

    static async deleteTenant (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Tenant not found",
                success : false
            })
        }

        const findTenant = await Tenant.findByPk(req.params.id)
        if(!findTenant) {
            return res.status(400).send({
                message : "Tenant not found",
                success : false
            })
        }

        try {
            const deleteTenant = await Tenant.destroy({where :{id : req.params.id }})
            if(deleteTenant){
                return res.status(200).send({
                    message : "Successfully deleted tenant",
                    success : true,
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to delete tenant",
                error : error.toString() || "Failed"
            })
        }
    }

    /////Plan
    static async createPlan(req, res) {
        if(!req.body.started_at || !req.body.amount || !req.body.tenant_id || !req.body.section_id) {
            return res.status(400).send({
                success: false,
                message : "Plan Basic information incomplete"
            })
        }

        const tenant = await Tenant.findByPk(req.body.tenant_id)
        const section = await Section.findByPk(req.body.section_id)
        if(!tenant || !section) {
            return res.status(400).send({
                success: false,
                message : "Tenant or section does not exist"
            })
        }

        const t = await sequelize.transaction()
        try {
            const plan = await Plan.create(req.body)
            if(plan) {
                await t.commit()
                return res.status(200).send({
                    success : true,
                    message : "Successfully created plan",
                    plan
                })
            }
        } catch (error) {
            await t.rollback()
            return res.status(400).send({
                success : false,
                message : "Unable to create plan",
                error : error.toString() || "Failed"
            })
        }
    }

    static async getPlans (req, res) {
        try {
            const plans = await Plan.findAll({ 
                // where : { active : true },
                include: [
                    { model : Payment },
                    { model : Promises },
                ],
            });
            if(plans){
                return res.status(200).send({
                    message : "Successfully fetched plans",
                    success : true,
                    plans
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to fetch plans",
                error : error.toString() || "Failed"
            })
        }
    }

    static async readPlan (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Plan not found",
                success : false
            })
        }


        try {
            const plan = await Plan.findOne({
                where : { id : req.params.id },
                include: [
                    { model : Payment },
                    { model : Promises },
                ],
            })
            if(plan){
                return res.status(200).send({
                    message : "Successfully fetched plan's information",
                    success : true,
                    plan
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to get plan's information",
                error : error.toString() || "Failed"
            })
        }
    }

    static async updatePlan (req, res) {
        const t = await sequelize.transaction()
        try {
            const updatePlan = await Plan.update(
                req.body,
                {  
                    where : { id : req.params.id },
                }
            );
            const plan = await Plan.findByPk(req.params.id)
            if(updatePlan && plan){
                await t.commit()
                return res.status(200).send({
                    message : "Successfully updated plan information",
                    success : true,
                    plan
                })
            }

        } catch (error) {
            await t.rollback()
            return res.status(400).send({
                success : false,
                message : "Unable to update plan information",
                error : error.toString() || "Failed"
            })
        }
    }
}

module.exports = TenantController;
