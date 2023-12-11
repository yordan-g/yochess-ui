export const piecesMap = new Map([
	["bk", "&#9818;"], ["wk", "&#9812;"],
	["bq", "&#9819;"], ["wq", "&#9813;"],
	["br", "&#9820;"], ["wr", "&#9814;"],
	["bb", "&#9821;"], ["wb", "&#9815;"],
	["bn", "&#9822;"], ["wn", "&#9816;"],
	["bp", "&#9823;"], ["wp", "&#9817;"]
]);

export const order = ['p', 'n', 'b', 'q', 'k', 'r'];
export const compareFn = (a: string, b: string) => order.indexOf(a[1]) - order.indexOf(b[1]);