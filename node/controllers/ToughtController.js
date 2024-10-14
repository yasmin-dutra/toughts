const Tought = require('../models/Tought')
const User = require('../models/User')

module.exports = class ToughtController {

    static async showToughts (req, res) {
        res.render('toughts/home')
    }

    static async dashboard (req, res){
        const userId = req.session.userid
       
        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: Tought,
            plain: true,
        })
       
        //check if user exist
        if(!user){
            res.redirect('/login')
        }
        console.log(user.Toughts)
        res.render('toughts/dashboard')
    }

    static async createToughts (req, res){
        res.render('toughts/create')
    }

    static async createToughtsSave (req, res) {
        const toughts = { 
            title: req.body.title, 
            userId: req.session.userId 
        }

        
        try{
            await Tought.create(toughts)

            req.flash('msg', 'O que vc está pensando já foi postado para seus amigos!')

            req.session.save(() => {
                res.redirect('/toughts/dashboard')
            })
        }catch(error){
            console,log('Ops! O error é: '+ error)
        }

    }
}