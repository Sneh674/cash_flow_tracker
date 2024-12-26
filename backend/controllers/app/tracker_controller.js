const createHTTPError = require("http-errors");
const categoryModel = require("../../models/category_model.js");

const addNewField = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { mainCategory, subCategory, desc, budget, amount, date, note } = req.body;

    // Check if the main category exists
    let cashFlow = await categoryModel.findOne({ userId, flowType: mainCategory });

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
      return res.status(201).json({ message: "New main category created", data: cashFlow });
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

    res.status(200).json({ message: "Field updated successfully", data: cashFlow });
  } catch (error) {
    return next(createHTTPError(500, `Error while processing: ${error.message}`));
  }
};

module.exports = { addNewField };
