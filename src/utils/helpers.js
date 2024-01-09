/**
 *
 * @param {{page: number; limit: number; customLabels: mongoose.CustomLabels;}} options
 * @returns {mongoose.PaginateOptions}
 */


export const getMongoosePaginationOptions = ({ page = 1, limit = 10,customLabels }) => {
    return {
        page: Math.max(page , 1),
        limit: Math.max(limit, 10),
        customLabels: {
            pagingCounter: "serialNumberStartFrom",
            ...customLabels,
        },
    };
}