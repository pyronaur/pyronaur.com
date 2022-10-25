
export async function fetchHabit(name): Promise<number[]> {
	const response = await fetch(`https://api.pyronaur.com/habits/${name}`);
	const data = await response.json();

	return data;
}