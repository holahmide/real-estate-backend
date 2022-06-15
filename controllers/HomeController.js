const Op = require('sequelize').Op;
const { Building, Section, Plan, Tenant, Payment, Promises, sequelize } = require('../models')

class HomeController {
    static async index (req, res) {
        try {
            let stats = {
                sections : {
                    active : 0,
                    filled : 0,
                    total : 0
                },
                tenants : 0,
                plans : 0,
                dues : [],
                promises : [],
                notices : [],
                total_dues : 0
            }

            //Tenants
            let tenants = await Tenant.count({ 
                // where : { active : true }
            });
            stats.tenants = tenants

            //Sections
            let activeSections = await Section.count({ 
                where : { active : true }
            });
            stats.sections.active = activeSections

            let filledSection = await Section.findAll({ 
                where : { active : true },
                include : [ {model : Plan, where : { active : true} }]
            });
            stats.sections.filled = filledSection.length

            let totalSection = await Section.count();
            stats.sections.total = totalSection

            //PLans
            let plans = await Plan.findAll({ 
                where : { active : true },
                include: [
                    { model : Payment },
                    // { model : Promises },
                    { model : Section },
                    { model : Tenant },
                ],
            });
            stats.plans = plans.length


            //Dues & Notices
            let total_dues = 0
            plans = JSON.parse(JSON.stringify(plans))
            plans.map(plan => {
                plan.payed = 0
                plan.Payments.forEach(payment => {
                    plan.payed += payment.amount
                })

                //Expired
                // let dateNow = new Date();
                // if(new Date(plan.expires_at) >= dateNow){
                    //Plans that are due and have not completed payment
                    if(Number(plan.amount) > plan.payed){
                        stats.dues.push(plan)
                        total_dues += (Number(plan.amount) - plan.payed)
                    }
                // }

                //Notice
                const date1 = new Date();
                const date2 = new Date(plan.expires_at);
                const diffTime = Math.abs(date2 - date1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                // if(diffDays < 32 && diffDays > 0) {
                if(diffDays < 32) {
                    stats.notices.push(plan)
                }
            })
            stats.total_dues = total_dues
            stats.dues.sort(function compare(a, b) {
                var dateA = new Date(a.started_at);
                var dateB = new Date(b.started_at);
                return dateA - dateB;
              });

            //Promises
            let promises = await Promises.findAll({ 
                where : { fufilled : false },
                include: [
                    { model : Plan, include : [ Section, Tenant] },
                ],
            });
            promises.map(promise => {
                let dateNow = new Date();
                if(new Date(promise.date) <= dateNow){
                    stats.promises.push(promise)
                }
            })

            return res.status(200).send({stats})
        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to fetch statistics",
                error : error.toString() || "Failed"
            })
        }
        
    }

    static async statement (req, res) {
        if(!req.body.tenant) {
            return res.status(400).send({
                message : "Tenant is required!"
            })
        }

        try {
            const tenant = await Tenant.findOne({
                where : { id : req.body.tenant },
                include : [ 
                    { model : Plan , order : ['id', 'DESC'], required : false, include : [ Payment, Section ]}
                ]
            })
            // let plans = JSON.parse(JSON.stringify(tenant.Plans))
            let plans = JSON.parse(JSON.stringify(tenant.Plans))
            const details = {
                firstname : tenant.firstname,
                lastname : tenant.lastname,
                email : tenant.email,
                phone : tenant.phone,
                from : (plans.length > 0 ? plans[0].created_at : null),
                to : (plans.length > 0 ? plans[plans.length -1].updated_at : null)
            }
            let log = []

            plans.forEach(plan => {
                //Sort
                plan.Payments.sort(function compare(a, b) {
                    var A = new Date(a.id);
                    var B = new Date(b.id);
                    return A - B;
                  });
                
                let payed = 0
                plan.Payments.forEach(payment => {
                    payed += payment.amount
                    const item = {
                        plan_id : plan.id,
                        payment_id : payment.id,
                        section : plan.Section.code,
                        bill : plan.amount,
                        payed : payment.amount,
                        balance : (plan.amount - payed),
                        date : payment.date,
                        status : plan.active,
                        started_at : plan.started_at,
                        expires_at : plan.expires_at,
                        created_at : payment.created_at
                    }
                    log.push(item)
                })
            })

            return res.status(200).send({
                message : 'Successfully fetched data',
                payments : log,
                details
            })

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to fetch statement",
                error : error.toString() || "Failed"
            })
        }
    }
}

module.exports = HomeController;
