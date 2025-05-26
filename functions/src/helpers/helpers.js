function isValidDateString(value) {
	const date = new Date(value);
	return !isNaN(date.getTime());
}

module.exports = {
	isValidDateString,
};
