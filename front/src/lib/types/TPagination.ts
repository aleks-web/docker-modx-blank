/*
    Пагинация
*/
export type TPagination = {
	total: number,
	totalPages: number,
	currentPage: number,
	nextPage: null|number,
	prevPage: null|number,
	pageSize: number
}