export const formatSet = (fields) =>
  fields.reduce((previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue]: `$fullDocument.${currentValue}`,
    };
  }, []);

export const formatProject = (fields) =>
  fields.reduce((previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue]: 1,
    };
  }, []);
