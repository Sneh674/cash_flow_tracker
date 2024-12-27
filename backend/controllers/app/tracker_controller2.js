const createHTTPError = require("http-errors");
const categoryModel = require("../../models/category_model.js");

const deleteTransaction=async(req,res,next)=>{
    try {
        const userId=req.user.id
    } catch (error) {
        return next(createHTTPError(500, `Error deleting transaction: ${error}`))
    }
}

const deleteSubCategory=async(req,res,next)=>{
    const mainCategory = req.params.mainCategory;
    const subCategory = req.params.id;
    const userId=req.user.id;

    try {
        const toDelete=await categoryModel.findOne({userId,flowType:mainCategory,"subCategories._id":subCategory})
        if (!toDelete) {
            return next(createHTTPError(404, `Subcategory not found`));
        }
        const indexToDelete=toDelete.subCategories.findIndex(i => i._id.toString() === subCategory)
        toDelete.subCategories.splice(indexToDelete,1)
        
        try {
            await toDelete.save()
            res.json({toDelete: toDelete.subCategories})
        } catch (error) {
            return next(createHTTPError(500,`Can't update deleted subCat to db: ${error}`))
        }
    } catch (error) {
        return next(createHTTPError(500,`Can't find subCategory to delete: ${error}`));
    }
}

module.exports={deleteTransaction, deleteSubCategory}