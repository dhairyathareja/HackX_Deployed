import Supplier from "../model/supplier.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";


export const supplierList= ErrorWrapper(async(req,res,next)=>{

    try {
        
        const supplierList = await Supplier.find();
        res.status(201)
        .json({
            message: "Product Updated Successfully",
            list:supplierList
        })


    } catch (error) {
        if(error) throw new ErrorHandler(401,error.message);
        throw new ErrorHandler(501,`Server Error Contact Admin`);
    }

})

export const feedback=ErrorWrapper(async(req,res,next)=>{

    const {supplierId,rating,description} = req.body;    
    
    if(!supplierId || !description || !rating ){
        throw new ErrorHandler(401,`Please Enter the details....`);
    }

    try {
        
        const supplier = await Supplier.findOne({_id:supplierId});
        
        let newFeeback = {
            rating,
            description
        }
        supplier.feedback.unshift(newFeeback);
        supplier.save();

        res.status(201)
        .json({
            message: "Feedback Sent Successfully",
            supplier:supplier
        })

        
    } catch (error) {
        if(error.message) throw new ErrorHandler(401,error.message);
        throw new ErrorHandler(501,`Contact Admin`);
    }

})



export const productList = ErrorWrapper(async (req,res,next) => {
    
    const{supplierId}=req.params;
    if(!supplierId){
        throw new ErrorHandler(401,`Please Enter the details....`);
    }


    try {
        
        const supplier=await Supplier.findOne({_id:supplierId});
       
        
        res.status(201)
        .json({
            message: "Suggestion Generated",
            supplier:supplier
        })

    } catch (error) {
        if(error.message) throw new ErrorHandler(401,error.message);
        throw new ErrorHandler(501,`Contact Admin`);  
    }

})
