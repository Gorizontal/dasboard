export const numberWithSpaces = (number: number) => {
    return number ?  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : 0;
  }