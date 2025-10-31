import express from "express";
import {addProduct, register, suggestion, updateDetail, updateProduct} from "../controller/supplier.controller.js"
const Router = express.Router();

Router.post('/register',register);
Router.post('/updateDetail',updateDetail);
Router.post('/addProduct',addProduct);
Router.post('/updateProduct',updateProduct);
Router.post('/suggestion',suggestion);


export default Router;