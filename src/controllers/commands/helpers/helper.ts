export let formatDate = (dateToFormat: Date): string => {
	return (dateToFormat.getFullYear() + "-"
		+ ("0" + (dateToFormat.getMonth() + 1)).slice(-2) + "-"
		+ ("0" + dateToFormat.getDate()).slice(-2) + "T"
		+ ("0" + dateToFormat.getHours()).slice(-2) + ":"
		+ ("0" + dateToFormat.getMinutes()).slice(-2) + ":"
		+ ("0" + dateToFormat.getSeconds()).slice(-2) + "."
		+ dateToFormat.getMilliseconds().toString());
};
