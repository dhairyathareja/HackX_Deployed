import express from "express";
import { feedback, productList, supplierList } from "../controller/user.controller.js";
const Router = express.Router();

Router.get('/fetchList',supplierList);
Router.post('/feedback',feedback);
Router.get('/productList/:supplierId', productList);




export default Router;