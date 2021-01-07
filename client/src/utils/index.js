export const convertToUTCTimezone = (date) => {
  if (date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let timestamp = new Date(year + '-' + month + '-' + day);
    timestamp.setUTCHours(0);
    return timestamp.toISOString();
  }
};
