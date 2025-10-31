import { Error } from "mongoose";
import Supplier from "../model/supplier.model.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../model/user.model.js";
import { GoogleGenAI } from "@google/genai";
import { compareSync } from "bcryptjs";

export const register = ErrorWrapper(async(req, res, next)=>{
   
    const {userId,name,email,phone,address,owner,gst,category} = req.body;
    
    if(!userId || !name || !email || !phone || !address || !owner || !category || !gst){
        throw new ErrorHandler(401,`Please Enter the details....`);
    }


    let existingSupplier = await Supplier.findOne({name:name});
    if(existingSupplier){
        throw new ErrorHandler(400,`Supplier Already Exists`);
    }


    try {
        
        const newSupplier= await Supplier.create({
            name,
            email,
            phone,
            address,
            owner,
            category,
            gst
        });

        let user=await User.findOne({email:userId});
        user.supplierId=newSupplier._id;
        user.save();

        res.status(201)
        .json({
            message: "Registered Successfully",
            Supplier:user
        })

    } catch (error) {
        if(error) throw new Error(401,error.message);
        throw new ErrorHandler(401,`Server Error, contact admin`);
    }
})

export const updateDetail = ErrorWrapper(async(req,res,next)=>{

    const {name,email,phone,address,category,id} = req.body;
    
    if(!name || !email || !phone || !address || !category || !id ){
        throw new ErrorHandler(401,`Please Enter the details....`);
    }
    
    try {
        const existingSupplier = await Supplier.findOne({_id:id});
        existingSupplier.name=name;
        existingSupplier.email=email;
        existingSupplier.phone=phone;
        existingSupplier.address=address;
        existingSupplier.category=category;
      

        existingSupplier.save();

        res.status(201)
        .json({
            message: "Registered Successfully",
            Supplier:existingSupplier
        })
    
    } catch (error) {
        if(error) throw new Error(401,error.message);
        throw new ErrorHandler(401,`Server Error, contact admin`);
    }


})

export const addProduct = ErrorWrapper(async(req,res,next)=>{

    const {name,category,stock,supllierId} = req.body;
    
    if(!name || !category || !stock || !supllierId){
        throw new ErrorHandler(401,`Please Enter the details....`);
    }
    
    try {
        
        let newProduct={
            name:name,
            category:category,
            stock:stock
        }

        const supplier=await Supplier.findOne({_id:supllierId});
        supplier.products.unshift(newProduct);
        supplier.save();

        res.status(201)
        .json({
            message: "Product Added Successfully",
            Supplier:supplier
        })
    
    } catch (error) {
        if(error) throw new Error(401,error.message);
        throw new ErrorHandler(401,`Server Error, contact admin`);
    }


})

export const updateProduct = ErrorWrapper(async (req, res, next) => {
  const {stock, supplierId, productIndx } = req.body;

  // validate presence (allow 0 for numeric fields)
  if (supplierId == null || productIndx == null || stock == null) {
    throw new ErrorHandler(400, `Please provide name, category, stock, supplierId and productIndx`);
  }

  try {
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      throw new ErrorHandler(404, "Supplier not found");
    }

    // ensure index is within bounds
    const idx = Number(productIndx);
    if (Number.isNaN(idx) || idx < 0 || idx >= supplier.products.length) {
      throw new ErrorHandler(400, "Invalid product index");
    }

    // update fields
    supplier.products[idx].stock = Number(stock);

    await supplier.save(); // await the save

    res.status(200).json({
      message: "Product updated successfully",
      products: supplier.products,
    });
  } catch (error) {
    console.error("updateProduct error:", error);
    if (error.message) throw new ErrorHandler(500, error.message);
    throw new ErrorHandler(500, `Server Error, contact admin`);
  }
});



export const suggestion = ErrorWrapper(async (req,res,next) => {
    
     const{supplierId}=req.body;
    if(!supplierId){
        throw new ErrorHandler(401,`Please Enter the details....`);
    }

    try {
        
        const supplier=await Supplier.findOne({_id:supplierId});
        let feed="";
        supplier.feedback.forEach(element => {
            let str=" Rating: "+element.rating + " description: " + element.description+",";
            feed+=str;
        });
        const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `I am a supplier and i'm geting these responses ${feed} , suggest me how can i improve my services. Don't provide response to each feedback, instead give a general stratogy`
        });
        console.log(response.text);
        res.status(201)
        .json({
            message: "Suggestion Generated",
            suggestion:response.text
        })

    } catch (error) {
        if(error.message) throw new ErrorHandler(401,error.message);
        throw new ErrorHandler(501,`Contact Admin`);  
    }

    

})

