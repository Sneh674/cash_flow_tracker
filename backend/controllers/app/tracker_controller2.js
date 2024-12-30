const createHTTPError = require("http-errors");
const categoryModel = require("../../models/category_model.js");

const deleteTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const mainCategory = req.params.mainCategory;
    const subCategory = req.params.subCategory;
    const transactionId = req.params.id;

    try {
      const toDelete = await categoryModel.findOne({
        userId,
        flowType: mainCategory,
        "subCategories.name": subCategory,
        "subCategories.transactions._id": transactionId,
      });
      if (!toDelete) {
        return next(createHTTPError(404, `Transaction not found`));
      }
      const indexOfSubCat = toDelete.subCategories.findIndex(
        (i) => i.name == subCategory
      );
      const indexToDelete = toDelete.subCategories[
        indexOfSubCat
      ].transactions.findIndex((i) => i._id.toString() == transactionId);
      console.log({ indexOfSubCat, indexToDelete });
      if (indexOfSubCat == -1 || indexToDelete == -1) {
        return next(createHTTPError(404, `Can't match index to delete`));
      }
      try {
        toDelete.subCategories[indexOfSubCat].transactions.splice(
          indexToDelete,
          1
        );
        await toDelete.save();
      } catch (error) {
        return next(
          createHTTPError(500, `Error deleting transaction in db:${error}`)
        );
      }
      res.json({ toDel: toDelete });
      // const indexToDelete=toDelete.subCategories
    } catch (error) {
      return next(
        createHTTPError(404, `Error can't find transaction to delete`)
      );
    }
  } catch (error) {
    return next(createHTTPError(500, `Error deleting transaction: ${error}`));
  }
};

const deleteSubCategory = async (req, res, next) => {
  const mainCategory = req.params.mainCategory;
  const subCategory = req.params.id;
  const userId = req.user.id;

  try {
    const toDelete = await categoryModel.findOne({
      userId,
      flowType: mainCategory,
      "subCategories._id": subCategory,
    });
    if (!toDelete) {
      return next(createHTTPError(404, `Subcategory not found`));
    }
    const indexToDelete = toDelete.subCategories.findIndex(
      (i) => i._id.toString() === subCategory
    );
    toDelete.subCategories.splice(indexToDelete, 1);

    try {
      await toDelete.save();
      res.json({ toDelete: toDelete.subCategories });
    } catch (error) {
      return next(
        createHTTPError(500, `Can't update deleted subCat to db: ${error}`)
      );
    }
  } catch (error) {
    return next(
      createHTTPError(500, `Can't find subCategory to delete: ${error}`)
    );
  }
};

const showAllCategories = async (req, res, next) => {
  const mainCategory = req.params.mainCategory;
  const userId = req.user.id;
  try {
    let showData = [];
    if (!mainCategory) {
      const allMainCat = await categoryModel.find({
        userId,
      });
      // console.log(allMainCat)
      // showData.push(allMainCat)
      allMainCat.forEach((category) => {
        category.subCategories.forEach((subCategory) => {
          showData.push({
            mainCategory: category.flowType,
            subCategoryName: subCategory.name,
            budget: subCategory.budget,
            subCategoryId: subCategory._id,
            description: subCategory.description,
          });
        });
      });
    } else {
      const selectedMainCat = await categoryModel.find({
        userId,
        flowType: mainCategory,
      });
      selectedMainCat.forEach((category) => {
        category.subCategories.forEach((subCategory) => {
          showData.push({
            mainCategory: category.flowType,
            subCategoryName: subCategory.name,
            budget: subCategory.budget,
            subCategoryId: subCategory._id,
            description: subCategory.description,
          });
        });
      });
      // showData.push(selectedMainCat.subCategories)
    }
    res.json({ allCategories: showData });
  } catch (error) {
    return next(createHTTPError(500, `Error getting all categories: ${error}`));
  }
};

const showTransactions = async (req, res, next) => {
  const mainCategory = req.params.mainCategory;
  const subCategory = req.params.subCategory;
  const userId = req.user.id;
  if (!mainCategory) {
    return next(createHTTPError(500, `Error getting main cat`));
  }
  try {
    let showData = [];
    if (!subCategory) {
      const allSubCat = await categoryModel.find({
        userId,
        flowType: mainCategory,
      });
      console.log(allSubCat);
      allSubCat.map((category) => {
        category.subCategories.map((subCat) => {
          subCat.transactions.map((transac) => {
            showData.push({
              amount: transac.amount,
              date: transac.date,
              note: transac.note,
              subCategory: subCat.name,
              mainCategory: category.flowType,
            });
          });
        });
      });
    } else {
      const selectedSubCat = await categoryModel.find({
        userId,
        flowType: mainCategory,
        "subCategories.name": subCategory,
      });
      console.log(selectedSubCat);
      selectedSubCat.map((category) => {
        if (category.flowType == mainCategory) {
          category.subCategories.map((subCat) => {
            if (subCat.name == subCategory) {
              subCat.transactions.map((transac) => {
                showData.push({
                  amount: transac.amount,
                  date: transac.date,
                  note: transac.note,
                  subCategory: subCat.name,
                  mainCategory: category.flowType,
                });
              });
            }
          });
        }
      });
    }
    res.json({ allTransactions: showData });
  } catch (error) {
    return next(
      createHTTPError(500, `Error getting all transactions: ${error}`)
    );
  }
};

module.exports = {
  deleteTransaction,
  deleteSubCategory,
  showAllCategories,
  showTransactions,
};
