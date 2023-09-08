const express=require("express")
const { getUsers, CreateUser, UpdateUser, DeleteUser, GetUser } = require("../Controllers/userControllers");
const { authProtect, restrictTo } = require("../Controllers/authConrollers");
const Router=express.Router()
// Router.use(authProtect,restrictTo("admin"))
Router.route("/").get(authProtect,restrictTo("admin"), getUsers).post(CreateUser)
Router.route("/:id").get(GetUser).patch(UpdateUser).delete(DeleteUser)

module.exports= Router;