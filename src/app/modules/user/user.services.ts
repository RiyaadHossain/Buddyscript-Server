import { userSearchableFields } from "./user.constants.js";
import type { IUserSearchAndFilterFields } from "./user.interface.js";
import { User } from "./user.model.js";
import { paginationHelpers } from "@/helpers/pagination-helper.js";
import type { IPaginationOptions } from "@/interfaces/pagination.js";
import type { SortOrder } from "mongoose";

const getAllUsers = async (
  paginationFields: IPaginationOptions,
  searchAndFilterFields: IUserSearchAndFilterFields
) => {
  // Pagination Options
  const { skip, page, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationFields);

  // Sort condition
  const sortCondition: { [key: string]: SortOrder } = {};
  sortCondition[sortBy] = sortOrder;

  // Filter Options
  const { searchTerm, ...filtersData } = searchAndFilterFields;

  const andCondition = [];
  if (searchTerm) {
    andCondition.push({
      $or: userSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereCondition = Object.keys(andCondition).length
    ? { $and: andCondition }
    : {};

  const data = await User.find(whereCondition).skip(skip).limit(limit).lean();
  const total = await User.countDocuments(whereCondition);

  return {
    users: data,
    meta: {
      page,
      limit,
      total,
    },
  };
};

export const UserService = {
  getAllUsers,
};
