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

module.exports = { addNewField, showAllTransactions };
