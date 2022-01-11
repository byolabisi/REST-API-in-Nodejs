import api from "./app";

let port: number;

if ((process.env.PORT != null) && !isNaN(+process.env.PORT)) {
	port = +process.env.PORT;
} else {
	port = 15100;
}

api.listen(port, () => {
	console.log("Listening on port " + port.toString());
});
