const Op = require('sequelize').Op;
const { Tenant, Plan, Section, Payment, Promises, Guarantor, sequelize } = require('../models');

class TenantController {
    static async createTenant (req, res) {
        // if(!req.body.email || !req.body.firstname || !req.body.lastname || !req.body.phone) {
        if(!req.body.firstname || !req.body.lastname) {
            return res.status(400).send({
                success: false,
                message : "Tenant Basic information incomplete"
            })
        }

        const t = await sequelize.transaction()
        try {
            let tenant = await Tenant.create(req.body)
            if(tenant) {
                //Create plan if any
                if(req.body.plan && req.body.plan.section_id) {
                    req.body.plan.tenant_id = tenant.id
                    req.body.plan.user_id = req.user.id
                    const plan = await Plan.create(req.body.plan)
                    if(plan && req.body.payment && req.body.payment.amount) {
                        req.body.payment.plan_id = plan.id
                        req.body.payment.user_id = req.user.id
                        const payment = await Payment.create(req.body.payment)
                    }
                }

                //Create Guarantor if any
                tenant = JSON.parse(JSON.stringify(tenant))
                tenant.Guarantor = {}
                if(req.body.guarantor && req.body.guarantor.phone){
                    req.body.guarantor.tenant_id = tenant.id
                    const createGuarantor = await Guarantor.create(req.body.guarantor)
                    let guarantor = JSON.parse(JSON.stringify(createGuarantor))
                    tenant.Guarantor = guarantor
                }

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
                    { model : Plan, include : [ Section ] },
                    { model : Guarantor }
                ],
            });
            if(tenants){
                let myTenants = JSON.parse(JSON.stringify(tenants)) 
                //Used at the frontend to create new tenant
                let sections = await Section.findAll({
                    where : { active : true },
                    include : [{ model : Plan , where : { active : true }, required: false }]
                })
                myTenants.forEach(tenant => {
                    tenant.active_plans = []
                    tenant.Plans.forEach(plan => {
                        if(plan.active) {
                            tenant.active_plans.push(plan)
                        }
                    })
                })

                myTenants.sort(function compare(a, b) {
                    var A = a.id;
                    var B = b.id;
                    return A - B;
                });
                return res.status(200).send({
                    message : "Successfully fetched tenants",
                    success : true,
                    tenants : myTenants,
                    sections
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
                message : "Plan's Basic information incomplete"
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
                where : { active : true },
                include: [
                    { model : Payment },
                    { model : Promises },
                    { model : Section },
                    { model : Tenant },
                ],
            });
            if(plans){
                let myPlans = JSON.parse(JSON.stringify(plans))
                let expired = []
                let active = []
                myPlans.forEach(plan => {
                    plan.payed = 0
                    plan.Payments.forEach(payment => {
                        plan.payed += payment.amount
                    })
                    if(plan.active){
                        var dateNow = new Date();
                        if(new Date(plan.expires_at) >= dateNow){
                            active.push(plan)
                        } else {
                            expired.push(plan)
                        }
                    }
                })
                return res.status(200).send({
                    message : "Successfully fetched plans",
                    success : true,
                    plans : myPlans,
                    active,
                    expired

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

    static async deletePlan (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Plan not found",
                success : false
            })
        }

        const findPlan = await Plan.findByPk(req.params.id)
        if(!findPlan) {
            return res.status(400).send({
                message : "Plan not found",
                success : false
            })
        }{}

        try {
            const deletePlan = await Plan.update(
                {active : false},
                { where :{id : req.params.id }}
            )
            if(deletePlan){
                return res.status(200).send({
                    message : "Successfully deleted plan",
                    success : true,
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to delete plan",
                error : error.toString() || "Failed"
            })
        }
    }

    static async renewPlan(req, res) {
        if(!req.body.old_plan || !req.body.started_at || !req.body.amount || !req.body.tenant_id || !req.body.section_id) {
            return res.status(400).send({
                success: false,
                message : "Plan's Basic information incomplete"
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
            const old_plan = await Plan.update(
                { active : false, finished_at : new Date()},
                { where : {id : req.body.old_plan} }
            )
            const plan = await Plan.create(req.body)
            if(plan) {
                await t.commit()
                return res.status(200).send({
                    success : true,
                    message : "Successfully renewed plan",
                    plan,
                    old_plan : req.body.old_plan
                })
            }
        } catch (error) {
            await t.rollback()
            return res.status(400).send({
                success : false,
                message : "Unable to renew plan",
                error : error.toString() || "Failed"
            })
        }
    }
}

module.exports = TenantController;
