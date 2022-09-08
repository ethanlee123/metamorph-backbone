/**
 * 
 * @param {*} unformattedDate in ISO format. Ex. 2022-09-08T05:09:35.880Z
 * @returns Ex. Sep 8, 2009
 */
export function formatDate(unformattedDate) {
    const d = new Date(unformattedDate)
    const year = d.getFullYear()
    const monthName = toMonthName(d.getMonth() + 1)
    const day = d.getDate()

    return `${monthName} ${day}, ${year}`
}

/**
 * 
 * @param {*} monthNumber 
 * @returns short month name. Ex. Sep
 */
function toMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString('en-US', {
        month: 'short',
    });
}