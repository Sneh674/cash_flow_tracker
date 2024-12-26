const createHTTPError = require("http-errors");
const categoryModel = require("../../models/category_model.js");

const addNewField = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { mainCategory, subCategory, desc, budget, amount, date, note } =
      req.body;

    // Check if the main category exists
    let cashFlow = await categoryModel.findOne({
      userId,
      flowType: mainCategory,
    });

    if (!cashFlow) {
      // Create a new main category with the subcategory and transaction
      cashFlow = await categoryModel.create({
        userId,
        flowType: mainCategory,
        subCategories: [
          {
            name: subCategory,
            description: desc,
            budget,
            transactions: [
              {
                amount,
                date: date || Date.now(),
                note,
              },
            ],
          },
        ],
      });
      return res
        .status(201)
        .json({ message: "New main category created", data: cashFlow });
    }

    // Check if the subcategory exists
    const subCategoryIndex = cashFlow.subCategories.findIndex(
      (sub) => sub.name === subCategory
    );

    if (subCategoryIndex !== -1) {
      // Subcategory exists: Add the transaction
      cashFlow.subCategories[subCategoryIndex].transactions.push({
        amount,
        date: date || Date.now(),
        note,
      });
    } else {
      // Subcategory doesn't exist: Add a new subcategory
      cashFlow.subCategories.push({
        name: subCategory,
        description: desc,
        budget,
        transactions: [
          {
            amount,
            date: date || Date.now(),
            note,
          },
        ],
      });
    }

    // Save the updated document
    await cashFlow.save();

    res
      .status(200)
      .json({ message: "Field updated successfully", data: cashFlow });
  } catch (error) {
    return next(
      createHTTPError(500, `Error while processing: ${error.message}`)
    );
  }
};

const showAllTransactions = async (req, res, next) => {
  try {
    // const mainCategory=req.params.mainCategory
    const userId = req.user.id;
    try {
      const transactionsData = await categoryModel
        .find({ userId })
        .sort({ date: -1 });
      // const transactions= await categoryModel.find({flowType:'inflow'})
      let t = [];
      // t.push({})
      for (let i = 0; i < transactionsData.length; i++) {
        subcatlen = transactionsData[i].subCategories.length;
        for (let j = 0; j < subcatlen; j++) {
          transactionslen =
            transactionsData[i].subCategories[j].transactions.length;
          for (let k = 0; k < transactionslen; k++) {
            t.push({
              flowType: transactionsData[i].flowType,
              sub: transactionsData[i].subCategories[j].name,
              amt: transactionsData[i].subCategories[j].transactions[k].amount,
              date: transactionsData[i].subCategories[j].transactions[k].date,
            });
          }
        }
      }
      t.sort((a, b) => b.date - a.date);
      // console.log(t);
      // res.json({ success: transactionsData})
      res.json({ ans: t });
    } catch (error) {
      return next(
        createHTTPError(500, `Error while fetching data from db: ${error}`)
      );
    }
  } catch (error) {
    return next(createHTTPError(500, `can't show all transactions: ${error}`));
  }
};

const editTransaction = async (req, res, next) => {};
const editSubCategory = async (req, res, next) => {
  try {
    const mainCategory = req.params.mainCategory;
    const subCategory = req.params.subCategory;
    const { name, budget, desc } = req.body;
    if (!subCategory || !mainCategory) {
      return next(createHTTPError(500, `No params found`));
    }
    try {
      // Fetch the category to perform validation
      const category = await categoryModel.findOne({
        "subCategories.name": subCategory,
      });

      if (!category) {
        return next(createHTTPError(404, `Sub-category not found.`));
      }
      try {
        // Check if the new name already exists (excluding the one being updated)
        const duplicate = category.subCategories.some(
          (subCat) => subCat.name === name && subCat.name !== subCategory
        );

        if (duplicate) {
          return next(
            createHTTPError(
              400,
              `A sub-category with the name "${name}" already exists.`
            )
          );
        }
      } catch (error) {
        return next(
          createHTTPError(
            500,
            `Error checking if name already exists: ${error}`
          )
        );
      }

      const updatedSubCat = await categoryModel.updateOne(
        { "subCategories.name": subCategory }, // Query to locate the array element
        {
          $set: {
            "subCategories.$.budget": budget, // Update budget
            "subCategories.$.description": desc, // Update description
            "subCategories.$.name": name,
          },
        }
      );

      res.json({ updated: updatedSubCat });
    } catch (error) {
      return next(createHTTPError(500, `Error updating in db: ${error}`));
    }
  } catch (error) {
    return next(createHTTPError(500, `Error updating subcategory: ${error}`));
  }
};

module.exports = {
  addNewField,
  showAllTransactions,
  editTransaction,
  editSubCategory,
};
