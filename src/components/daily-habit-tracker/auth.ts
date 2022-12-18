export function getCookie(key) {
	const cookies = document.cookie.split(";");
	const cookie = cookies.find((c) => c.includes(key));
	return cookie ? cookie.split("=")[1] : null;
}

export function getCredentials() {
	const username = getCookie("username");
	const token = getCookie("token");
	if (username && token.length >= 32) {
		return { username, token };
	}
	return false;
}