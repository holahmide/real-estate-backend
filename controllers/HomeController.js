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
                if(diffDays < 35 && diffDays > 0) {
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

}

module.exports = HomeController;
