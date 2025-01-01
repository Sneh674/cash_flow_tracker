const createHTTPError = require("http-errors");
const categoryModel = require("../../models/category_model.js");
const randomString = require("random-string");

// Function to generate a transactionId
// const generateTransactionId = () => {
//   return new Promise((resolve) => {
//     const transactionId = randomString({ length: 20 });
//     resolve(transactionId);
//   });
// };

const addSubCategory = async (req, res, next) => {
  const userId = req.user.id;
  const { mainCategory, subCategory, desc, budget, img } = req.body;
  if (!mainCategory) {
    return next(createHTTPError(500, "couldn't get main category"));
  }
  if (!subCategory) {
    return next(createHTTPError(400, "add category name"));
  }
  try {
    let cashFlow = await categoryModel.findOne({
      userId,
      flowType: mainCategory,
      "subCategories.name": subCategory,
    });
    if (cashFlow) {
      return next(createHTTPError(500, "Sub category already exists"));
    }
    try {
      let mainExists = await categoryModel.findOne({
        userId,
        flowType: mainCategory,
      });
      if (!mainExists) {
        mainExists = await categoryModel.create({
          userId,
          flowType: mainCategory,
          subCategories: [
            {
              name: subCategory,
              description: desc,
              budget,
              transactions: [],
            },
          ],
        });
      } else {
        mainExists = await categoryModel.findOneAndUpdate(
          { userId, flowType: mainCategory },
          {
            subCategories: [
              {
                name: subCategory,
                description: desc,
                budget,
                transactions: [],
              },
            ],
          }
        );
      }
      res.json({ addedsubcat: mainExists });
    } catch (error) {
      return next(createHTTPError(500, `Error adding sub category:${error}`));
    }
  } catch (error) {
    return next(createHTTPError(500, `Error adding sub category: ${error}`));
  }
};

const addTransaction = async (req, res, next) => {
  const userId = req.user.id;
  const { mainCategory, subCategory, amount, note, date } = req.body;
  try {
    let subCat = await categoryModel.findOne({
      userId,
      flowType: mainCategory,
      "subCategories.name": subCategory,
    });
    if (!subCat) {
      return next(createHTTPError(500, "No such sub category found"));
    }
    // const subCategoryIndex=subCat.findIndex
    const indexToAdd = subCat.subCategories.findIndex(
      (i) => i.name === subCategory
    );
    try {
      if (indexToAdd == -1) {
        return next(createHTTPError(500, "index of sub cat not found"));
      }
      subCat.subCategories[indexToAdd].transactions.push({
        amount,
        date,
        note,
      });
      await subCat.save();
    } catch (err) {
      return next(
        createHTTPError(500, `Error adding transaction to db:${err}`)
      );
    }
    res.json({ new: subCat });
  } catch (error) {
    return next(createHTTPError(500, `Error adding transaction: ${error}`));
  }
};

const addNewField = async (req, res, next) => {
  try {
    // const transactionId=randomString({ length: 20 });
    const transactionId = await generateTransactionId();
    const userId = req.user.id;
    const { mainCategory, subCategory, desc, budget, amount, date, note } =
      req.body;

    // Check if the main category exists
    let cashFlow = await categoryModel.findOne({
      userId,
      flowType: mainCategory,
    });

    console.log(cashFlow);
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
                transactionId,
              },
            ],
          },
        ],
      });
      return res.status(201).json({
        message: "New main category created",
        data: cashFlow,
        transactionId: cashFlow.subCategories[0].transactions[0].transactionId,
      });
    }

    // Check if the subcategory exists
    const subCategoryIndex = cashFlow.subCategories.findIndex(
      (sub) => sub.name === subCategory
    );

    // console.log("trial");
    // console.log(subCategoryIndex);
    if (subCategoryIndex !== -1) {
      // Subcategory exists: Add the transaction
      cashFlow.subCategories[subCategoryIndex].transactions.push({
        amount,
        date: date || Date.now(),
        note,
        transactionId,
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
            transactionId,
          },
        ],
      });
    }

    console.log(cashFlow);
    // Save the updated document
    try {
      await cashFlow.save();
    } catch (err) {
      if (err.code === 11000) {
        return next(
          createHTTPError(
            400,
            `Duplicate sub-category name found: "${subCategory}". Error: ${err}.`
          )
        );
      }
      throw err; // Re-throw for other errors
    }

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
    const limit=8
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
      const paginatedTransactions = t.slice(0, 0 + limit);

      res.json({ ans: paginatedTransactions });
    } catch (error) {
      return next(
        createHTTPError(500, `Error while fetching data from db: ${error}`)
      );
    }
  } catch (error) {
    return next(createHTTPError(500, `can't show all transactions: ${error}`));
  }
};

// const showAllTransactions = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const page = parseInt(req.query.page) || 1; // Default to page 1
//     const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
//     const skip = (page - 1) * limit;

//     try {
//       const transactionsData = await categoryModel
//         .find({ userId })
//         .sort({ date: -1 });
//       let t = [];
//       for (let i = 0; i < transactionsData.length; i++) {
//         const subcatlen = transactionsData[i].subCategories.length;
//         for (let j = 0; j < subcatlen; j++) {
//           const transactionslen =
//             transactionsData[i].subCategories[j].transactions.length;
//           for (let k = 0; k < transactionslen; k++) {
//             t.push({
//               flowType: transactionsData[i].flowType,
//               sub: transactionsData[i].subCategories[j].name,
//               amt: transactionsData[i].subCategories[j].transactions[k].amount,
//               date: transactionsData[i].subCategories[j].transactions[k].date,
//             });
//           }
//         }
//       }
//       t.sort((a, b) => b.date - a.date);
//       const paginatedTransactions = t.slice(skip, skip + limit);

//       res.json({ ans: paginatedTransactions });
//     } catch (error) {
//       return next(
//         createHTTPError(500, `Error while fetching data from db: ${error}`)
//       );
//     }
//   } catch (error) {
//     return next(createHTTPError(500, `can't show all transactions: ${error}`));
//   }
// };


const editTransaction = async (req, res, next) => {
  try {
    const mainCategory = req.params.mainCategory;
    const subCategory = req.params.subCategory;
    const tId = req.params.transactionId;
    const userId = req.user.id;
    const { amount, date, note } = req.body;
    if (!subCategory || !mainCategory || !tId) {
      return next(createHTTPError(500, `No params found`));
    }
    const toUpdate = await categoryModel.findOne({
      userId: userId,
      flowType: mainCategory,
      "subCategories.name": subCategory,
      "subCategories.transactions._id": tId,
    });
    if (!toUpdate) {
      return next(createHTTPError(500, `can't find data to update`));
    }

    const updateFields = {};

    if (amount !== undefined) {
      updateFields["subCategories.$.transactions.$[elem].amount"] = amount;
    }

    if (note !== undefined) {
      updateFields["subCategories.$.transactions.$[elem].note"] = note;
    }

    if (date !== undefined) {
      updateFields["subCategories.$.transactions.$[elem].date"] = date;
    }
    try {
      const updatedTransaction = await categoryModel.findOneAndUpdate(
        {
          userId: userId,
          flowType: mainCategory,
          "subCategories.name": subCategory,
          "subCategories.transactions._id": tId,
        },
        {
          $set: updateFields,
        },
        {
          arrayFilters: [{ "elem._id": tId }],
          new: true, // To return the updated document
        }
      );
      res.json({ updated: updatedTransaction });
    } catch (error) {
      return next(
        createHTTPError(500, `Error updating transaction in db: ${error}`)
      );
    }
  } catch (error) {
    return next(createHTTPError(500, `Error updating transaction: ${error}`));
  }
};
const editSubCategory = async (req, res, next) => {
  try {
    const mainCategory = req.params.mainCategory;
    const subCategory = req.params.subCategory;
    const userId = req.user.id;
    let { name, budget, desc, imgUrl } = req.body;
    if (!subCategory || !mainCategory) {
      return next(createHTTPError(500, `No params found`));
    }
    try {
      // console.log(await categoryModel.findOne({"subCategories.name": "Freelance"},{ "subCategories.$": 1 }))
      // Fetch the category to perform validation
      const category = await categoryModel.findOne({
        userId,
        flowType: mainCategory,
        "subCategories.name": subCategory,
      });

      if (!category) {
        return next(createHTTPError(404, `Sub-category not found.`));
      }
      const indexOfSubCat = category.subCategories.findIndex(
        (i) => i.name === subCategory
      );
      if (!name) {
        name = category.subCategories[indexOfSubCat].name;
      }
      if (!budget) {
        budgete = category.subCategories[indexOfSubCat].budget;
      }
      if (!desc) {
        desc = category.subCategories[indexOfSubCat].description;
      }
      if (!imgUrl) {
        imgUrl = category.subCategories[indexOfSubCat].imgUrl;
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
        {
          userId,
          flowType: mainCategory,
          "subCategories.name": subCategory,
        }, // Query to locate the array element
        {
          $set: {
            "subCategories.$.budget": budget, // Update budget
            "subCategories.$.description": desc, // Update description
            "subCategories.$.name": name,
            "subCategories.$.imgUrl": imgUrl,
          },
        }
      );

      res.json({ updated: updatedSubCat, cat: category });
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
  addSubCategory,
  addTransaction,
};
