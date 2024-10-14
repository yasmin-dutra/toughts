const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }


    static async loginPost (req, res) {
        const {email, password} = req.body;

        //find user
        const user = await User.findOne({where: {email:email}})

        if(!user){
            req.flash('msg', 'Usuário não existe!')
            res.render('auth/login')
                return
        }
        //check if pass match
        const passMatch = bcrypt.compareSync(password, user.password );

        if(!passMatch){
            req.flash('msg', 'Senha invalida!')
            res.render('auth/login')
                return
        }

        //inicializando session
        req.session.userid = user.id
        req.flash('msg', 'Altenticação realizado!')

        req.session.save(() => {
        res.redirect('/')
        })
    }

    static register(req,res) {
        res.render('auth/register')
    }

    static async registerPost(req,res) {

        const {name, email, password, confipassword } = req.body

        //confirmação da senha
        if(password != confipassword){
            req.flash('msg', 'Verifique a senha!')
            res.render('auth/register')
                return
            } 
        //validando email
        const checkIfUserExist = await User.findOne( {where: {email: email}} )
            if(checkIfUserExist){
                req.flash('msg', 'E-mail já existe!')
                res.render('auth/register')
                    return
            }

        //criando senha
        const salt = bcrypt.genSaltSync(10)
        const hashedPass = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPass
            }

        try{
            const createdUser = await User.create(user)
            req.session.userid = createdUser.id
            //inciando sessão
            req.flash('msg', 'Cadastro realizado c/ sucesso!')
            res.redirect('/')
        }catch(err){
            console.log(err)
            }
    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}

