export const formatFilter = (fields) =>
  fields.reduce((previousValue, currentValue) => {
    const [[key, value]] = Object.entries(currentValue);

    return {
      ...previousValue,
      [`fullDocument.${key}`]: value,
    };
  }, []);

export const formatExists = (fields) =>
  fields.reduce((previousValue, currentValue) => {
    return {
      ...previousValue,
      [`updateDescription.updatedFields.${currentValue}`]: {
        $exists: true,
      },
    };
  }, []);

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
