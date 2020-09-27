const Op = require('sequelize').Op;
const { Building, Section, Plan, Tenant, Payment, sequelize } = require('../models')

class BuildingController {
    static async create (req, res) {
        if(!req.body.location) {
            return res.status(400).send({
                success: false,
                message : "Building Loaction not found"
            })
        }
        const t = await sequelize.transaction()
        try {
            const createBuilding = await Building.create(req.body)
            const code = "B" + createBuilding.id
            if(createBuilding){
                const setCode = await Building.update(
                    {
                        "code" : code
                    },
                    { where : { id : createBuilding.id } }
                );
                await t.commit()
                let building = createBuilding
                building.code = code

                return res.status(200).send({
                    message : "Successfully created building",
                    success : true,
                    building
                })

            }

        } catch (error) {
            await t.rollback()
            return res.status(400).send({
                success : false,
                message : "Unable to add building",
                error : error.toString() || "Failed"
            })
        }
    }

    static async getBuildings (req, res) {
        try {
            const buildings = await Building.findAll({ 
                where : { active : true },
                include: [
                    { model : Section, where : { active : true } , include : [ {model : Plan, include : [ Tenant, Payment ], where : { active : true }, required: false } ]  },
                ],
            });
            if(buildings){
                let myBuildings = JSON.parse(JSON.stringify(buildings))
                // Sort Data
                myBuildings.map(building => {
                    building.Sections.map(section => {
                        section.plan = null
                        section.Plans.map(plan => {
                            plan.payed = 0
                            plan.Payments.map(payment => {
                                plan.payed += payment.amount
                            })
                            delete plan.Payments
                            if(plan.active == true) {
                                section.plan = plan
                            }
                        })
                    })
                    building.Sections.reverse()
                });
                return res.status(200).send({
                    message : "Successfully fetched buildings",
                    success : true,
                    buildings : myBuildings
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to fetch buildings",
                error : error.toString() || "Failed"
            })
        }
    }

    static async read (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Building not found",
                success : false
            })
        }


        try {
            const building = await Building.findOne({
                where : { id : req.params.id },
                include: [
                    { model : Section },
                ],
            })
            if(building){
                return res.status(200).send({
                    message : "Successfully fetched building's information",
                    success : true,
                    building
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to get building",
                error : error.toString() || "Failed"
            })
        }
    }

    static async update (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Building not found",
                success : false
            })
        }

        const findBuilding = await Building.findByPk(req.params.id)
        if(!findBuilding) {
            return res.status(400).send({
                message : "Building not found",
                success : false
            })
        }

        const t = await sequelize.transaction()
        try {
            const updateBuilding = await Building.update(
                req.body,
                {  
                    where : { id : req.params.id },
                }
            );
            const building = await Building.findByPk(req.params.id)
            if(updateBuilding && building){
                await t.commit()
                return res.status(200).send({
                    message : "Successfully updated building",
                    success : true,
                    building
                })
            }

        } catch (error) {
            await t.rollback()
            return res.status(400).send({
                success : false,
                message : "Unable to update building",
                error : error.toString() || "Failed"
            })
        }
    }

    static async delete (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Building not found",
                success : false
            })
        }

        const findBuilding = await Building.findByPk(req.params.id)
        if(!findBuilding) {
            return res.status(400).send({
                message : "Building not found",
                success : false
            })
        }

        try {
            const deleteBuilding = await Building.destroy({where :{id : req.params.id }})
            if(deleteBuilding){
                return res.status(200).send({
                    message : "Successfully deleted building",
                    success : true,
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to delete building",
                error : error.toString() || "Failed"
            })
        }
    }



    ////// Building >> Section
    static async createSection (req, res) {
        if(!req.body.type || !req.body.building) {
            return res.status(400).send({
                success: false,
                message : "Section details incomplete"
            })
        }

        const building = await Building.findOne({where : {id : req.body.building}})

        if(!building) {
            return res.status(400).send({
                success: false,
                message : "Building not found"
            })
        }

        req.body.building_id = building.id
        const t = await sequelize.transaction()
        try {
            const createSection = await Section.create(req.body)
            const code = building.code + '-' + createSection.id
            if(createSection){
                const setCode = await Section.update(
                    {
                        "code" : code
                    },
                    { where : { id : createSection.id } }
                );
                await t.commit()
                let section = createSection
                section.code = code
                return res.status(200).send({
                    message : "Successfully created section",
                    success : true,
                    section
                })

            }

        } catch (error) {
            await t.rollback()
            return res.status(400).send({
                success : false,
                message : "Unable to add section to building",
                error : error.toString() || "Failed"
            })
        }
    }

    static async readSection (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Section not found",
                success : false
            })
        }


        try {
            const section = await Section.findOne({
                where : { id : req.params.id },
                include: [
                    { model : Building },
                ],
            })
            if(section){
                return res.status(200).send({
                    message : "Successfully fetched section's information",
                    success : true,
                    section
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to get section",
                error : error.toString() || "Failed"
            })
        }
    }

    static async getSections (req, res) {
        try {
            const sections = await Section.findAll({ 
                where : { active : true },
                include: [
                    { model : Building },
                ],
            });
            if(sections){
                return res.status(200).send({
                    message : "Successfully fetched sections",
                    success : true,
                    sections
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to fetch sections",
                error : error.toString() || "Failed"
            })
        }
    }

    static async updateSection (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Section not found",
                success : false
            })
        }

        const findSection = await Section.findByPk(req.params.id)
        if(!findSection) {
            return res.status(400).send({
                message : "Section not found",
                success : false
            })
        }


        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Section not found",
                success : false
            })
        }

        const t = await sequelize.transaction()
        try {
            const updateSection = await Section.update(
                req.body,
                {  
                    where : { id : req.params.id },
                }
            );
            const section = await Section.findByPk(req.params.id)
            if(updateSection && section){
                await t.commit()
                return res.status(200).send({
                    message : "Successfully updated section",
                    success : true,
                    section
                })
            }

        } catch (error) {
            await t.rollback()
            return res.status(400).send({
                success : false,
                message : "Unable to update section",
                error : error.toString() || "Failed"
            })
        }
    }

    static async deleteSection (req, res) {
        if(!req.params.id && Number(req.params.id)) {
            return res.status(400).send({
                message : "Section not found",
                success : false
            })
        }

        const findSection = await Section.findByPk(req.params.id)
        if(!findSection) {
            return res.status(400).send({
                message : "Section not found",
                success : false
            })
        }

        try {
            // const deleteSection = await Section.destroy({where :{id : req.params.id }})
            const deleteSection = await Section.update(
                {active : false },
                { where :{id : req.params.id }}
            )
            if(deleteSection){
                return res.status(200).send({
                    message : "Successfully deleted section from building",
                    success : true,
                })
            }

        } catch (error) {
            return res.status(400).send({
                success : false,
                message : "Unable to delete section",
                error : error.toString() || "Failed"
            })
        }
    }

}

module.exports = BuildingController;
