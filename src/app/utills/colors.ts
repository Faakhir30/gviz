let assignedColrs: any = {};
export const generateColors = (tableName: string) => {
  if (assignedColrs[tableName]) return assignedColrs[tableName];
  let color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  while (Object.values(assignedColrs).includes(color)) {
    color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
  assignedColrs[tableName] = color;
  return color;
};
