import { getCookie, getCredentials, isLoggedIn } from "./auth";

export type Habit = {
	label: string;
	slug: string;
	history: number[];
};

export async function getDefinedHabits(): Habit[] {
	return [
		{
			label: "Morning Walk",
			slug: "walk",
			history: [],
		},
		{
			label: "Code",
			slug: "code",
			history: [],
		},
		{
			label: "Writing",
			slug: "write",
			history: [],
		},
		{
			label: "Track",
			slug: "track",
			history: [],
		},
	];
}

export type Days = Array<{
	day: number;
	slugs: string[];
}>;

function dateToDays(date: Date) {
	return Math.floor(date.getTime() / 86400000);
}

export function getToday() {
	return dateToDays(new Date());
}

export function getDays(habits: Habit[]): Days {
	// First, find the earliest day that any habit was tracked
	let earliestDate = new Date();
	earliestDate.setDate(earliestDate.getDate() - 90);
	let earliestDay = dateToDays(earliestDate);

	habits.forEach((habit) => {
		const minHistory = Math.min(...habit.history);
		if (minHistory < earliestDay) {
			earliestDay = minHistory;
		}
	});

	// Next, create a map of days to the habits that were tracked on that day
	const daysToHabits = new Map<number, string[]>();
	habits.forEach((habit) => {
		habit.history.forEach((day) => {
			if (!daysToHabits.has(day)) {
				daysToHabits.set(day, []);
			}
			daysToHabits.get(day)!.push(habit.slug);
		});
	});

	// Finally, create the array of Days objects, including entries for every day
	// from the earliest day to today
	const days: Days = [];
	const today = dateToDays(new Date());
	for (let day = earliestDay; day <= today; day++) {
		days.push({
			day,
			slugs: daysToHabits.get(day) || [],
		});
	}
	return days.sort((a, b) => b.day - a.day);
}

export async function fetchHabit(name): Promise<number[]> {
	const response = await fetch(`https://api.pyronaur.com/habits/${name}`);
	const data = await response.json();

	return data;
}

export async function fetchHabitHistory() {
	const habits = await getDefinedHabits();
	const promises = habits.map((habit) => fetchHabit(habit.slug));
	const results = await Promise.all(promises);
	return habits.map((habit, i) => {
		habit.history = results[i];
		return habit;
	});
}

export async function updateHabit(name: string, history: number[]) {
	const credentials = getCredentials();
	if (!credentials) {
		console.error("Not logged in");
		return;
	}
	const { username, token } = credentials;
	const response = await fetch(`https://api.pyronaur.com/habits/${name}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-PY-USER": username,
			"X-PY-KEY": token,
		},
		body: JSON.stringify(history),
	});
	if (response.status !== 200) {
		console.error(response);
	}
	return response.status === 200;
}

export async function toggleHabit(habit: Habit) {
	const today = dateToDays(new Date());
	let savedHistory = [...habit.history];
	if (habit.history[0] === today) {
		habit.history = habit.history.slice(1);
	} else {
		habit.history = [today, ...habit.history];
	}

	const success = await updateHabit(habit.slug, habit.history);
	if (!success) {
		habit.history = savedHistory;
		return false;
	}

	return true;
}
