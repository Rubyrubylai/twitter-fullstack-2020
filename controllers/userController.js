const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

const userController = {
  registerPage: (req, res) => {
    return res.render('register')
  },
  register: (req, res) => {
    if (req.body.confirmPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/users/register')
    } else {
      // confirm unique user
      User.findOne({
        where: {
          $or: [
            { email: req.body.email },
            { account: req.body.account }
          ]
        }
      })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱或賬號重複！')
            return res.redirect('/users/register')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              account: req.body.account,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/users/login')
            })
          }
        })
    }
  },
  loginPage: (req, res) => {
    return res.render('login')
  },
  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出')
    res.logout()
    return redirect('/users/login')
  }
}

module.exports = userController