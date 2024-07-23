export const makeFallBack = (firstName: string, lastName: string) => {
    const firstLetter = firstName?.substring(0, 1);
    const secondLetter = lastName?.substring(0, 1);

    return firstLetter + secondLetter || "NU";
  };